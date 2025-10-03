export default {
    routes: [
        {
            method: 'POST',
            path: '/github/sync',
            handler: 'github.sync',
            config: {
                auth: false,
            },
        },
    ],
};
