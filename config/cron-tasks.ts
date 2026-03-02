import type { Core } from '@strapi/strapi';

export default {
    '0 */12 * * *': async ({ strapi }: { strapi: Core.Strapi }) => {
        strapi.log.info('⏳ Syncing pinned GitHub repos (cron)...');
        await strapi.plugin('github-sync').service('sync').sync();
        strapi.log.info('✅ GitHub repos sync complete (cron).');
    },
};
