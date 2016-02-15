import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  text: String,
  done: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
