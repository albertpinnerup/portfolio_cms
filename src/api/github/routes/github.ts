export default {
    routes: [
        {
            method: 'POST',
            path: '/github/sync',
            handler: 'github.sync',
            config: {
                auth: {
                    scope: ['admin'], // 👈 only admins can trigger
                },
            },
        },
    ],
};
