const express = require('express');
const router = express.Router();

// Get message
router.get('/api/message/:id', (req, res) => {
    console.log('Get message');
    const messages = req.db.get('messages');
    if (req.session.user.role === 'ADMIN') {
        messages
            .findOneAndUpdate({ id: +req.params.id }, { $set: { isRead: true } })
            .then(message => {
                if (message) {
                    res.json({ message });
                } else {
                    res.sendStatus(404);
                    console.log('No message!');
                }
            });
    } else {
        res.sendStatus(400);
    }
});

// My messages
router.get('/api/my-messages', (req, res) => {
    console.log('My message:');
    const users = req.db.get('users');
    if (req.session.user) {
        users.findOne({ id: req.session.user.id }).then(user => {
            console.log(user);
            const messages = req.db.get('messages');
            messages.find({ id: { $in: user.messages } }).then(msgs => {
                console.log('Messages:', msgs);
                if (msgs[0]) {
                    res.json({
                        messages: msgs
                    });
                } else {
                    res.sendStatus(404);
                    console.log('No messages!');
                }
            });
        });
    } else {
        res.sendStatus(401);
    }
});

// (POST) Send message to Admin
router.post('/api/send-message', (req, res) => {
    const messages = req.db.get('messages');
    messages.count().then(len => {
        ++len;
        messages.insert({
            id: len,
            msg: req.body.text,
            date: Date.now(),
            phone: req.body.phone,
            email: req.body.email
        });
        const users = req.db.get('users');
        users.findOneAndUpdate({ id: 0 }, { $push: { messages: len } }).then(() => {
            res.sendStatus(200);
        });
    });
});

module.exports = router;
