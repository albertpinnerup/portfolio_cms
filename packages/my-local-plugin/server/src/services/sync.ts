import type { Core } from '@strapi/strapi';
import fetch from 'node-fetch';

interface Repo {
  name: string;
  description: string | null;
  url: string;
  languages: { nodes: { name: string }[] };
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async sync() {
    strapi.log.info('🚀 Starting GitHub sync…');

    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;

    if (!token || !username) {
      strapi.log.error('❌ Missing GITHUB_TOKEN or GITHUB_USERNAME');
      throw new Error('Missing GITHUB_TOKEN or GITHUB_USERNAME');
    }

    // Fetch ALL repos instead of just pinned
    const query = `
      {
        user(login: "${username}") {
          repositories(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              description
              url
              languages(first: 3) {
                nodes { name }
              }
            }
          }
        }
      }
    `;

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const repos: Repo[] = json?.data?.user?.repositories?.nodes ?? [];
    let created = 0;
    let updated = 0;

    strapi.log.info(`Found ${repos.length} repos`);

    for (const repo of repos) {
      const slug = repo.name.toLowerCase();

      const existing = await strapi.documents('api::project.project').findFirst({
        filters: { slug },
      });

      if (existing) {
        // 🔄 Update — do NOT touch "featured"
        await strapi.documents('api::project.project').update({
          documentId: existing.documentId,
          data: {
            title: repo.name,
            description: existing.description || repo.description, // Only update description if it was empty
          },
          status: 'published',
        });
        updated += 1;
        strapi.log.info(`🔄 Updated project: ${slug}`);
      } else {
        await strapi.documents('api::project.project').create({
          data: {
            slug,
            title: repo.name,
            description: repo.description,
          },
          status: 'published',
        });
        created += 1;
        strapi.log.info(`✅ Created project: ${slug}`);
      }
    }

    strapi.log.info('✨ GitHub sync finished');

    return {
      created,
      updated,
      total: repos.length,
    };
  },
});
