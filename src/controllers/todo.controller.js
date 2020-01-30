const { Todo } = require('../mongoose');

const getTodosByUserId = async userId => {
	return await Todo.find({ user: userId, deleted: false }).lean();
};

const removeTodoById = async id => {
	return await Todo.updateOne({ _id: id }, { deleted: true });
};

const updateTodoById = async (id, update) => {
	await Todo.updateOne({ _id: id }, update);
	return await Todo.findOne({ _id: id }).lean();
};

const addNewTodo = async todo => {
	return await Todo.create(todo);
};

module.exports = {
	getTodosByUserId,
	removeTodoById,
	updateTodoById,
	addNewTodo,
};
