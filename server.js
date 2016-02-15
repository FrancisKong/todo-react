import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import router from './router';

mongoose.connect('mongodb://mongodb://127.0.0.1/todo');

const app = express();

// register middlerware
app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(router);

app.listen(3000);

/* eslint-disable no-console */
console.log('app listen on port 3000');
