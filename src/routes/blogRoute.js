const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");

const blogRouter = new Router();

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
		if(islive && islive != "boolean") 
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
		const blogs = await Blog.find({});
		return res.send(blogs);
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
		return res.send(blog);
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
		res.send(blog);
	} catch(err) { 
		console.log(err);
		res.status(500).send({err: err.message});
	}
});

blogRouter.patch('/:blogId/islive', async (req, res) => {
	// 부분적으로 수정할 때 patch
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

module.exports = { blogRouter };