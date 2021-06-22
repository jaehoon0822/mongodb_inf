const express = require("express");
const mongoose = require("mongoose");
const {
	userRouter, blogRouter
} = require("./routes");
// const { generateFakeData } = require("../faker2")

const app = express();
const { PORT } = process.env;
const { MONGO_URI } = process.env

if (!MONGO_URI) throw new Error("MONGO_URI is not exeist");
if (!PORT) throw new Error("PORT is not exeist");

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

		app.listen(PORT, async () => {
			console.log(`Example app listening at http://localhost:${PORT}`);
			// console.time("execution time: ");
			// await generateFakeData(10, 2, 10);
			// console.timeEnd("execution time: ");
		});

	} catch (err) {
		console.log(err);
	}
}

server();