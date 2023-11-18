// Create web server
// Created: Feb 28, 2021 11:46 PM
// By: Adarsh Gupta
const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');
const { check, validationResult } = require('express-validator');

// @route   GET /api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
	try {
		const comments = await Comment.find();
		res.json(comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST /api/comments
// @desc    Post a comment
// @access  Public
router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('comment', 'Comment is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		const { name, email, comment } = req.body;

		try {
			const newComment = new Comment({
				name,
				email,
				comment,
			});

			const commentSaved = await newComment.save();
			res.json(commentSaved);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Public
router.delete('/:id', async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment)
			return res.status(404).json({ msg: 'Comment not found' });

		await comment.remove();
		res.json({ msg: 'Comment deleted' });
	} catch (err) {
		if (err.kind === 'ObjectId')
			return res.status(404).json({ msg: 'Comment not found' });

		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
