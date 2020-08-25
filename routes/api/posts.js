const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Post model
const Post = require('../../models/Post');
//Profile model
const Profile = require('../../models/Profile');

//Validation
const validatePostInput = require('../../validation/post');

// @route   GET /api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ mes: 'Posts works' }));

// @route   GET /api/posts
// @desc    Fetch all posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => {
            if (!posts) {
                return res.status(404).json({ msg: 'No posts found' });
            }
            res.json(posts);
        })
        .catch(err => res.status(404).json({ msg: 'No posts found' }));
});

// @route   GET /api/posts/:id
// @desc    Fetch post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res
                    .status(404)
                    .json({ msg: 'Post with this ID not found' });
            }
            res.json(post);
        })
        .catch(err =>
            res.status(404).json({ msg: 'Post with this ID not found' })
        );
});

// @route   POST /api/posts
// @desc    Create post
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newPost = new Post({
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id
        });

        //Save post
        newPost.save().then(post => res.json(post));
    }
);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //Check for post owner
                    if (post.user != req.user.id) {
                        return res
                            .status(401)
                            .json({ user: 'User not authorized' });
                    }

                    //Delete
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ post: 'Post not found' }));
        });
    }
);

// @route   POST /api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length > 0
                    ) {
                        return res.status(400).json({
                            alreadyliked: 'Post already liked by the user'
                        });
                    }

                    //Add user id to likes array
                    post.likes.unshift({ user: req.user.id });

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ post: 'Post not found' }));
        });
    }
);

// @route   POST /api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length === 0
                    ) {
                        return res.status(400).json({
                            notliked: "User hasen't liked the post yet"
                        });
                    }

                    const removeIndex = post.likes
                        .map(like => like.id)
                        .indexOf(req.user.id);

                    //Splice like off likes array
                    post.likes.splice(removeIndex, 1);

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ post: 'Post not found' }));
        });
    }
);

// @route   POST /api/posts/comment/:post_id
// @desc    Comments on the posts
// @access  Private
router.post(
    '/comment/:post_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        Post.findById(req.params.post_id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.user.name,
                    avatar: req.user.avatar,
                    user: req.user.id
                };

                //Add Comment to the post
                post.comments.unshift(newComment);

                //Save
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({ post: 'Post not found' }));
    }
);

// @route   DELETE /api/posts/comment/:post_id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete(
    '/comment/:post_id/:comment_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findById(req.params.post_id)
            .then(post => {
                //Check if comment exists
                if (
                    post.comments.filter(
                        comment =>
                            comment._id.toString() === req.params.comment_id
                    ).length === 0
                ) {
                    return res
                        .status(400)
                        .json({ comment: "Comment dosen't exist" });
                }

                //Get remove index
                const removeIndex = post.comments
                    .map(item => item.id.toString())
                    .indexOf(req.param.comment_id);

                //Splice that comment
                post.comments.splice(removeIndex);

                //Save
                post.save().then(post => res.json({ post }));
            })
            .catch(err => res.status(404).json({ post: 'Post not found' }));
    }
);

module.exports = router;
