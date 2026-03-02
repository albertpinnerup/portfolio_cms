import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('github-sync')
      // the name of the service file & the method.
      .service('sync')
      .getWelcomeMessage();
  },
});

export default controller;

