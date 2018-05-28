const express = require('express');
const router = express.Router();

// Get message
router.get('/api/message/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('messages')
            .findOneAndUpdate({ id: +req.params.id }, { $set: { isRead: true } })
            .then(message => {
                if (message) {
                    res.json({ message });
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// Get "My messages"
router.get('/api/my-messages', (req, res) => {
    // Check if there's a user in the session
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        // Find user
        req.db
            .get('users')
            .findOne({ id: req.session.user.id })
            .then(user => {
                // Get his messages
                req.db
                    .get('messages')
                    .find({ id: { $in: user.messages } })
                    .then(msgs => {
                        // Send
                        if (msgs[0]) {
                            res.json({
                                messages: msgs
                            });
                        } else {
                            res.sendStatus(404);
                        }
                    });
            });
    }
});

// Send a message to the Admin
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
