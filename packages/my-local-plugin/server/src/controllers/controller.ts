import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('github-sync')
      .service('service')
      .getWelcomeMessage();
  },

  async sync(ctx) {
    const result = await strapi.plugin('github-sync').service('sync').sync();

    ctx.body = result;
  },
});

export default controller;
