const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');

// @route   GET /api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ mes: 'User works' }));

// @route   GET /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            res.status(400).json({ msg: 'Email already exists' });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //Size
                r: 'pg', //Rating
                d: 'mm' //Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

module.exports = router;
