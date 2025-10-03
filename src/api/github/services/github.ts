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
            return;
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

        strapi.log.info(`Found ${repos.length} repos`);

        for (const repo of repos) {
            const slug = repo.name.toLowerCase();

            const found = await strapi.documents('api::project.project').findMany({
                filters: { slug },
                limit: 1,
            });

            if (found.length > 0) {
                // 🔄 Update — do NOT touch "featured"
                await strapi.documents('api::project.project').update({
                    documentId: found[0].documentId,
                    data: {
                        title: repo.name,
                        description: repo.description,
                        about: `Imported from GitHub: ${repo.url}`,
                    },
                });
                strapi.log.info(`🔄 Updated project: ${slug}`);
            } else {
                // ➕ Create — default featured = false
                await strapi.documents('api::project.project').create({
                    data: {
                        slug,
                        title: repo.name,
                        description: repo.description,
                        about: `Imported from GitHub: ${repo.url}`,
                        featured: false, // default, you control it manually later
                        publishedAt: new Date(),
                    },
                });
                strapi.log.info(`✅ Created project: ${slug}`);
            }
        }

        strapi.log.info('✨ GitHub sync finished');
    },
});
