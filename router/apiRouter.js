let Happening = require('../model/Happening');
let uuidV4 = require('uuid/v4');

function apiRouter(router) {

    router.post('/addcomment', function (req, res) {
        if (!req.body.happeningId) return res.status(400).send('Missing happeningId');
        if (!req.body.comment) return res.status(400).send('Missing comment');

        const happeningId = req.body.happeningId

        Happening.findOne({ id: happeningId }, function (err, happening) {
            if (err) return res.status(500).send('Error retrieveing happening');

            happening.comments = [...happening.comments, { id: uuidV4(), comment: req.body.comment }];

            happening.save((err, post) => {
                if (err) return res.status(500).send('Error when saving comment');

                res.status(200).json({ happening: happening });
            })
        });
    });

    router.get('/loadhappenings', function (req, res) {
        Happening.find(function (err, happenings) {
            if (err) return res.status(500).send('Error retrieving happenings');

            const happeningsArray = happenings.map(item => {
                const happening = {
                    id: item.id,
                    title: item.title,
                    place: item.place,
                    time: item.time,
                    description: item.description,
                    participants: item.participants,
                    comments: item.comments
                }

                return happening;
            })

            res.status(200).json({ happenings: happeningsArray });
        });
    });

    router.post('/addhappening', function (req, res) {
        if (!req.body.happening) return res.status(400).send('Missing Happening');
        if (!req.body.happening.title) return res.status(400).send('Missing title');
        if (!req.body.happening.place) return res.status(400).send('Missing place');
        if (!req.body.happening.time) return res.status(400).send('Missing time');
        if (!req.body.happening.description) return res.status(400).send('Missing description');

        const happening = new Happening({
            id: uuidV4(),
            owner: 'Andrzej Thingstad',
            title: req.body.happening.title,
            place: req.body.happening.place,
            time: req.body.happening.time,
            description: req.body.happening.description,
            comments: [],
            participants: []
        });

        happening.save((err, post) => {
            if (err) return res.status(500).send('Error creating happening');

            res.status(200).json({ happening: happening });
        });
    })

    return router
}

module.exports = apiRouter;