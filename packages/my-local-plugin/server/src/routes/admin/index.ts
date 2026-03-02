export default () => ({
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/sync",
      handler: "controller.sync",
      config: {
        policies: [],
      },
    },
  ],
});
