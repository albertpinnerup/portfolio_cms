import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async sync(ctx) {
        try {
            const result = await strapi.service('api::github.github').sync();
            ctx.body = result;
        } catch (err: any) {
            strapi.log.error(`❌ GitHub sync failed: ${err.message}`);
            ctx.throw(500, err.message);
        }
    },
});
