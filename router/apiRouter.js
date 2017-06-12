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
        if (!req.body.title) return res.status(400).send('Missing title');
        if (!req.body.place) return res.status(400).send('Missing place');
        if (!req.body.time) return res.status(400).send('Missing time');
        if (!req.body.description) return res.status(400).send('Missing description');

        const happening = new Happening({
            id: uuidV4(),
            owner: 'Andrzej Thingstad',
            title: req.body.title,
            place: req.body.place,
            time: req.body.time,
            description: req.body.description,
            comments: [],
            participants: []
        });

        happening.save((err, post) => {
            if (err) return res.status(500).send('Error creating happening');

            res.status(200).json({ happening: happening });
        });
    });

    router.post('/joinHappening', function (req, res) {
        if (!req.body.name) return res.status(400).send('Missing name');
        if (!req.body.happeningId) return res.status(400).send('Missing happeningId');

        const happeningId = req.body.happeningId;
        const name = req.body.name;

        Happening.findOne({ id: happeningId }, function (err, happening) {
            if (err) return res.status(500).send('Error retrieveing happening');

            happening.participants = [{ id: 1, name: name }, ...happening.participants];

            happening.save((err, post) => {
                if (err) return res.status(500).send('Error when saving participant');

                res.status(200).json({ happening: happening });
            })
        });
    });

    return router
}

module.exports = apiRouter;