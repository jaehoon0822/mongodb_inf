const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoute.js");
const { blogRouter } = require("./routes/blogRoute.js");

const app = express();
const port = 3000;
const MONGO_URI = 'mongodb+srv://admin:9KFH9ObdjVJnbQUF@mongodbtutorial.uksk8.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async() => {
	try {
		await mongoose.connect(MONGO_URI, { 
			useNewUrlParser: true, 
			useUnifiedTopology: true, 
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log('MongoDB connect');

		app.use(express.json());
		app.use('/user', userRouter);
		app.use('/blog', blogRouter);

		app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
	} catch(err) {
		console.log(err);
	}
}

server();
