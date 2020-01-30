const mongoose = require('mongoose');
const { ObjectId } = require('bson');

mongoose.connect(
	'mongodb+srv://new-user:WxayHpAz94AkfpdT@cluster0-oaa6h.mongodb.net/test?retryWrites=true&w=majority',
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
	}
);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const todoSchema = new mongoose.Schema({
	user: ObjectId,
	todo: String,
	completed: { type: Boolean, default: false },
	deleted: { type: Boolean, default: false },
});

const User = mongoose.model('user', userSchema);
const Todo = mongoose.model('todo', todoSchema);

module.exports = {
	db: mongoose.connection,
	User,
	Todo,
};
