const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Blog, User, Comment } = require("../models");
const { commentRouter } = require("./commentRoute");

const blogRouter = new Router();

blogRouter.use('/:blogId/comment', commentRouter);

blogRouter.post('/', async (req, res) => {
	try {
		const { title, content, islive, userId } = req.body;
		let user = await User.findById(userId);

		if(!user) 
			return res.status(400).send({ err: "user is not exist" });
		if(typeof title != 'string') 
			return res.sttaus(400).send({ err: "title is required" });
		if(typeof content != 'string') 
			return res.staus(400).send({ err: "content is required" });
		if(islive && typeof islive != "boolean") 
			return res.status(400).send({ err: "islive is required" });
		if(!isValidObjectId(userId)) 
			return res.status(400).send({ err: "userid is required" });
		
		let blog = new Blog({ ...req.body, user });
		await blog.save();
		return res.send({ blog });
		
	} catch(err) { 
		console.log(err);
		res.status(500).send({err: err.message});
	}
});

blogRouter.get('/', async (req, res) => {
	try {
		let { page } = req.query;
		page = parseInt(page);
		console.log({ page });
		const blogs = await Blog.find({})
			.sort({ updatedAt: -1 })
			.skip(page * 3)
			.limit(3);
			// .populate([
				// { path: 'user' }, 
				// { path: 'comments', populate: { path: 'user' } }]);

		return res.send({ blogs });
	} catch(err) { 
		console.log(err);
		res.status(500).send({err: err.message});
	}
});

blogRouter.get('/:blogId', async (req, res) => {
	try {
		const { blogId } = req.params;	
		if(!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalied" });

		const blog = await Blog.findById(blogId);
		// const commentCount = await Comment.find({ blog: blogId }).countDocuments();
		return res.send({ blog, commentCount });
		
	} catch(err) { 
		console.log(err);
		res.status(500).send({err: err.message});
	}
});

blogRouter.put('/:blogId', async (req, res) => {
	try {
		const { blogId } = req.params;
		if(!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalied" });

		const { title, content } = req.body;
		if(typeof title != 'string') 
			return res.status(400).send({ err: "title is required" });
		if(typeof content != 'string') 
			return res.status(400).send({ err: "content is required" });

		const blog = await Blog.findOneAndUpdate({_id: blogId}, { title, content }, { new: true});


		res.send({ blog });
	} catch(err) { 
		console.log(err);
		res.status(500).send({err: err.message});
	}
});

blogRouter.patch('/:blogId/live', async (req, res) => {
	// ??????????????? ????????? ??? patch
	try {
		const { blogId } = req.params;
		if(!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalied" });

		const { islive } = req.body;
		if(typeof islive != 'boolean') 
			res.status(400).send({ err: "islive must be boolean" });

		const blog = await Blog.findByIdAndUpdate(blogId, { islive }, { new: true });
		res.send( blog );

	} catch(err) { 
		console.log(err);
		res.status(500).send({err: err.message});
	}
});

blogRouter.delete('/:blogId', async (req, res) => {
	const { blogId } = req.params; 
	if (!isValidObjectId(blogId))
		return res.status(400).send({ err: "blogId is invalid" });
	const blog = await Blog.findByIdAndDelete(blogId);
	res.send({ blog });
});

module.exports = { blogRouter };
