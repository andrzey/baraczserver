function apiRouter(router) {
    router.get('/', function (req, res) {
        res.status(200).send('Hallo');
    });

    return router
}

module.exports = apiRouter;