import { Router } from 'express';
import Todo from './model/todo';
import mongoose from 'mongoose';

const router = new Router();

router.get('/api/todos', (req, res, next) => {
  Todo.find()
    .then(todos => res.send(todos))
    .catch(next);
});

router.post('/api/todos', (req, res, next) => {
  Todo.create({ text: req.body.text, done: false })
    .then(() => Todo.find().then(todos => res.json(todos)).catch(next))
    .catch(next);
});

router.put('/api/todos', (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  Todo.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { done: req.body.done })
    .then(() => Todo.find().then(todos => res.json(todos)).catch(next))
    .catch(next);
});

router.delete('/api/todos/:todoid', (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  Todo.remove({ _id: new ObjectId(req.params.todoid) })
    .then(() => Todo.find().then(todos => res.json(todos)).catch(next))
    .catch(next);
});

// error handle
router.use((err, req, res, next) => {
  if (err) res.send(err);
  next();
});

router.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

export default router;
