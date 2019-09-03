const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load user model
const User = require('../../models/Users');

// @route   GET /api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'User works' }));

// @route   POST /api/users/register
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

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user in db by email
    User.findOne({ email }).then(user => {
        //If not found
        if (!user) {
            return res.status(404).json({ email: 'User not found' });
        }

        //Compare password
        bcrypt.compare(password, user.password).then(onEqual => {
            if (onEqual) {
                res.status(200).json({ msg: 'Success' });
            } else {
                return res.status(400).json({ password: 'Incorrect Password' });
            }
        });
    });
});

module.exports = router;
