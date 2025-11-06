import express from 'express';
import quizController from './controller.ts';
import db from './models.ts';
import cors from 'cors';
const PORT = 3000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

app.use((req, res, next) => {
  console.log('➡️', req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/notes', quizController.getNotes, (req, res) => {
  res.status(200).json(res.locals.notes);
});

app.post('/newlog', quizController.postLog, (req, res) => {
  res.status(200).json(res.locals.newLog);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'there was an error',
    status: 500,
    message: 'something went wrong',
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
