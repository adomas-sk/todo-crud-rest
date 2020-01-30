require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { db } = require('./mongoose');
const { loginUser, registerUser } = require('./controllers/user.controller');
const { getTodosByUserId, removeTodoById, updateTodoById, addNewTodo } = require('./controllers/todo.controller');
const { authenticationMiddleware } = require('./auth.middleware');

const app = express();

app.use(bodyParser.json());

app.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new Error('No email or password');
		}
		const token = await loginUser(email, password);
		res.send({ token });
	} catch (error) {
		next(error.message);
	}
});

app.post('/signup', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new Error('No email or password');
		}
		const token = await registerUser(email, password);
		res.send({ token });
	} catch (error) {
		next(error.message);
	}
});

app.get('/todos', authenticationMiddleware, async (req, res, next) => {
	try {
		const user = res.locals.user;
		const todos = await getTodosByUserId(user._id);
		res.send({ todos });
	} catch (error) {
		next(error.message);
	}
});
app.post('/todo', authenticationMiddleware, async (req, res, next) => {
	try {
		const { todo } = req.body;
		const newTodo = await addNewTodo({ user: res.locals.user._id, todo });
		res.send({ todo: newTodo });
	} catch (error) {
		next(error.message);
	}
});
app.put('/todo', authenticationMiddleware, async (req, res, next) => {
	try {
		const { id, todo } = req.body;
		const updatedTodo = await updateTodoById(id, todo);
		res.send({ todo: updatedTodo });
	} catch (error) {
		next(error.message);
	}
});
app.delete('/todo', authenticationMiddleware, async (req, res, next) => {
	try {
		const { id } = req.body;
		await removeTodoById(id);
		res.send({ success: true });
	} catch (error) {
		next(error.message);
	}
});

app.get('/', (req, res) => {
	res.send('pong');
});

app.use((error, req, res, next) => {
	res.status(400).send({ error });
});

db.on('error', error => {
	console.error(error.message);
});

db.once('open', () => {
	console.log('Opened mongoDB connection');
	app.listen(process.env.PORT, '0.0.0.0', () => console.log(`Server listening on ${process.env.PORT}`));
});
