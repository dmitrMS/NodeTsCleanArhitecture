import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { TrackHandler } from '../server/handler/track/index';

export const track = Router();
const db = new Database();
const jwt = new Jwt(db);
const trackHandler = new TrackHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод чтобы начать работу
track.post('/track/start', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_name, task_id } = req.body;
  const result = await trackHandler.start(token, task_name, task_id);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Есть незаконченная работа!' });
});

// метод чтобы закончить работу
track.post('/track/stop', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const result = await trackHandler.stop(token);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

// метод для изменения работы
track.post('/track/update', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { id_work, task_name, begin_date, end_date } = req.body;
  const result = await trackHandler.update(
    token,
    id_work,
    task_name,
    begin_date,
    end_date
  );

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

// сетод для удаления работы
track.post('/track/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { id_work } = req.body;
  await trackHandler.delete(token, id_work);

  return res.status(200).json({ message: 'Работа удалена' });
});

// метод для проверки на текущую работу
track.post('/track/status', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await trackHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для выода списка команд
track.post('/track/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await trackHandler.list(token, team_id);

  return res.status(200).json(verifyWork);
});

// метод для вывода списка командных работ пользователя
track.post('/team/track/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await trackHandler.listTeam(token, team_id);

  return res.status(200).json(verifyWork);
});

// метод для вывода списка работ на определённое задание 
track.post('/task/track/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_id } = req.body;
  const verifyWork = await trackHandler.listTask(token, task_id);

  return res.status(200).json(verifyWork);
});
