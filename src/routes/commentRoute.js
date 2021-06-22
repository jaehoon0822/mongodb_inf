const { Router } = require("express");
const { isValidObjectId, startSession } = require("mongoose");
const commentRouter = new Router({ mergeParams: true });
const { Comment, Blog, User } = require("../models");

/* 
	/user
	/blog
	/blog/:blogId/comment
*/

commentRouter.post('/', async (req, res) => {
	// const session = await startSession();
	let comment;
	try {
		// await session.withTransaction(async () => {
		const { blogId } = req.params;
		const { content, userId } = req.body;
		if (!isValidObjectId(blogId))
			return res.status(400).send({ err: "blogid is not ObjectId" })
		if (!isValidObjectId(userId))
			return res.status(400).send({ err: "userId is not ObjectId" })
		if (typeof content != "string")
			return res.status(400).send({ err: "content is required" })

		const [blog, user] = await Promise.all([
			// Blog.findById(blogId, {}, { session }),
			// User.findById(userId, {}, { session }),
			Blog.findById(blogId),
			User.findById(userId),
		]);

		if (!blog && !user)
			return res.status(400).send({ err: "blog and user is not exist" });
		if (!blog.islive)
			return res.status(400).send({ err: "blog is not avaliabel" });

		comment = new Comment({
			content,
			blog: blogId,
			user,
			userFullname: `${user.name.first} ${user.name.last}`
		});

		// await Promise.all([
		// 	comment.save(),
		// 	Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
		// ]);

		// blog.commentCount++;
		// blog.comments.push(comment);
		// if(blog.commentCount > 3) {
		// 	blog.comments.shift();
		// }

		// await Promise.all([
		// 	comment.save({ session }),
		// 	blog.save()
		// 	// Blog.updateOne(
		// 	// 	{ _id: blogId },
		// 	// 	{ $inc: { commentCount: 1 } }
		// 	// ),
		// ]);

		await Promise.all([
			comment.save(),
			Blog.updateOne(
				{ _id: blogId },
				{
					$inc: { commentCount: 1 },
					$push: {
						comments: {
							$each: [comment],
							$slice: -3
						}
					},
				}
			)
		]);

		return res.send({ comments: comment });
		// });
	} catch (err) {
		return res.status(500).send({ err: err.message })
	} finally {
		// await session.endSession();
	}
});

commentRouter.get('/', async (req, res) => {
	try {
		let { page = 0 } = req.query;
		page = parseInt(page);
		const { blogId } = req.params;
		if (!isValidObjectId(blogId))
			return res.status(400).send({ err: "blogId is not avaliabel" });

		const comments = await Comment.find({ blog: blogId })
			.sort({ updatedAt: -1 })
			.skip(page * 3)
			.limit(3);

		res.send({ comments });
	} catch (err) {
		return res.status(500).send({ err: err.message })
	}
});

commentRouter.patch('/:commentId', async (req, res) => {
	const { commentId } = req.params;
	if (!isValidObjectId(commentId))
		return res.status(400).send({ err: "comment is unvalid" });
	const { content } = req.body;
	if (typeof content != 'string')
		return res.status(400).send({ err: "contetn is not string" });

	const [comment] = await Promise.all([
		Comment.findOneAndUpdate(
			{ _id: commentId, },
			{ content },
			{ new: true },
		),
		Blog.updateOne(
			{ 'comments._id': commentId },
			{ 'comments.$.content': content },
		)
	]);

	return res.send({ comments: comment });
});

commentRouter.delete("/:commentId", async (req, res) => {
	const { commentId } = req.params;
	if (!isValidObjectId(commentId))
		res.status(400).send({ err: "commendId is invalid" });

	const comment = await Comment.findOneAndDelete({ _id: commentId });
	await Blog.updateOne(
		{ 'comments._id': commentId },
		{ $pull: { comments: { _id: commentId } } },
	);

	return res.send({ comments: comment });
});

module.exports = { commentRouter };