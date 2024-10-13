const Todo = require('../models/Todos');
const Users = require('../models/Users');

exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const todo = new Todo({
            title,
            description,
            user: req.user.id
        });

        await todo.save();

        return res.status(201).json({
            success: true,
            message: "Todo created successfully!",
            todo
        });
    } catch (e) {
        console.error(`Error creating Todo: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while creating the Todo: ${e.message}`
        });
    }
};

exports.getTodos = async (req, res) => {
    try {
        const userId = req.user.id;

        const todos = await Todo.find({ user: userId });

        return res.status(200).json({
            success: true,
            todos,
            userId
        });
    } catch (e) {
        console.error(`Error fetching todos: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while fetching todos: ${e.message}`,
        });
    }
};

exports.starredTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById({ _id: id });
        console.log(todo);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Invalid Todo"
            });
        }
        console.log("check star : ", todo.isStarred);
        todo.isStarred = !(todo.isStarred);
        await todo.save();

        return res.json({
            success: true,
            message: "Todo starred status updated successfully",
            todo,
        });
    } catch (e) {
        console.error(`Error updating starred status: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while updating starred status: ${e.message}`,
        });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user;

        console.log(id, userId);

        const todo = await Todo.findOne({ _id: id, user: userId.id });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found or you don't have permission to update it.",
            });
        }

        todo.title = title || todo.title;
        todo.description = description || todo.description;

        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully.",
            todo,
        });
    } catch (e) {
        console.error(`Error updating todo: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while updating the todo: ${e.message}`,
        });
    }
};
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete({ _id: id });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found or you don't have permission to delete it.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully.",
        });
    } catch (e) {
        console.error(`Error deleting todo: ${e.message}`);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while deleting the todo: ${e.message}`,
        });
    }
};

