const express = require("express");
const mongoose = require("mongoose");
const {
	userRouter, blogRouter
} = require("./routes");
const { generateFakeData } = require("../faker2")

const app = express();
const port = 3000;
const MONGO_URI = 'mongodb+srv://admin:9KFH9ObdjVJnbQUF@mongodbtutorial.uksk8.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		// mongoose.set("debug", true);
		console.log('MongoDB connect');

		app.use(express.json());
		app.use('/user', userRouter);
		app.use('/blog', blogRouter);

		app.listen(port, async () => {
			console.log(`Example app listening at http://localhost:${port}`);
			console.time("execution time: ");
			await generateFakeData(10, 2, 10);
			console.timeEnd("execution time: ");
		});

	} catch (err) {
		console.log(err);
	}
}

server();