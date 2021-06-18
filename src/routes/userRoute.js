const { Router } = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/User");

const userRouter = Router();

userRouter.get("/", async(req, res) => {
	try {
		const users = await User.find({});
		return res.send({ users });
	} catch(err) {
		return res.status(500).send({ err: err.message });
	}
});

userRouter.get("/:userId", async(req, res) => {
	try {
		const { userId } = req.params;
		if(mongoose.isValidObjectId(userId)) {
			const user = await User.findOne({ _id: userId });				
			return res.send({ user });
		} else {
			return res.status(400).send({ err: "invalid userid " });
		}
	} catch(err) {
		return res.status(500).send({ err: err.message });
	}
});

userRouter.post("/", async(req, res) => {
	try {
		let { username, name } = req.body;
		if(!username) {
			return res.status(400).send({ err: "username is required" });
		}
		if(!name || !name.first || !name.last) {
			return res.status(400).send({ err: "name or name.first or name.last is requried" });
		}
		const user = new User(req.body);
		await user.save(); // user document 생성시 비동기처리로 인해 await 을 사용하여 동기적으로 만든다.
		return res.send( user );
	} catch(err) {
		return res.status(500).send({ err: err.message });
	}
});

userRouter.put("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		if(!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid ObjectId" });
		
		const { age, name } = req.body;
		if(!age && !name) return res.status(400).send({ err: "age or name is required" });
		if(age && typeof age !== "number") return res.status(400).send({err: "age must be a number"});
		if(name && typeof name !== "object") return res.status(400).send({err: "name must be a object"});
		/*
		let updateBody = {};

		if(age) updateBody.age = age;
		if(name) updateBody.name = name;

		const user = await User.findByIdAndUpdate(userId, { $set: updateBody }, { new: true });
		*/

		const user = await User.findOne({ _id: userId });
		console.log({userBeforeEdit: user});
		if(age) user.age = age;
		if(name) user.name = name;
		console.log({userAfterEdit: user});
		await user.save();
		return res.send( user );
	} catch(err) {
		return res.status(500).send({ err: err.message });
	}
});

userRouter.delete('/:userId', async(req, res) => {
	try {
		const { userId } = req.params;
		if(!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid ObjectId" });
		const user = await User.findOneAndDelete({ _id: userId });
		return res.send({ user });
	} catch(err) {
		return res.status(500).send({ err: err.message });
	}
});

module.exports = { userRouter };
