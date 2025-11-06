import type { RequestHandler } from 'express';
import db from './models.ts';
interface controller {
  getNotes: RequestHandler;
  postLog: RequestHandler;
}

interface Log {
  name: string;
  score: number;
  time: string;
}
const quizController: controller = {
  getNotes: async (req, res, next) => {
    console.log('😀inside middleware');
    const allNotes = 'SELECT * FROM notes';
    const response = await db.query(allNotes);
    const notes = response.rows;
    console.log(notes);
    if (!notes) {
      next({
        log: 'there was an error in the getNotes middleware',
        message: 'could not fetch requested data',
      });
    }
    res.locals.notes = notes;
    return next();
  },

  postLog: async (req, res, next) => {
    console.log('inside postLog middleware');
    const { name, score, mode } = req.body;
    const addLog = 'INSERT INTO log (name, score, mode) VALUES ($1, $2, $3)';
    await db.query(addLog, [name, score, mode]);
    const getLog =
      'SELECT name, score, mode, created_at FROM log ORDER BY created_at DESC LIMIT 5';
    const response = await db.query(getLog);
    if (!response) {
      return next({
        log: 'there was an issue making insert query to db',
        message: 'something went wrong in postLog middleware',
      });
    }
    const createdLog = response.rows;
    const t = createdLog.map((log) => new Date(log.created_at));
    const formatted = t.map((t) =>
      t.toLocaleString('en-US', {
        month: 'long', // “November”
        day: 'numeric', // “5”
        year: 'numeric', // “2025”
        hour: 'numeric', // “9”
        minute: '2-digit', // “04”
        hour12: true, // use “pm”
      })
    );
    const logToReturn: Log[] = [];
    for (let i = 0; i < createdLog.length; i++) {
      let log = createdLog[i];
      let obj = {
        name: log.name,
        score: log.score,
        mode: log.mode,
        time: formatted[i],
      };
      logToReturn.push(obj);
    }

    console.log('🍊log', logToReturn);
    res.locals.newLog = logToReturn;
    return next();
  },
};
export default quizController;
