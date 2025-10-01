/**
 * `global-populate` middleware
 */

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
    // Add your own logic here.
    return async (ctx, next) => {
        console.dir(ctx.query, { depth: null });
        strapi.log.info('In global-populate middleware.');

        await next();
    };
};
