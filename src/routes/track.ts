import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { TrackHandler } from '../server/handler/track/index';
// import { Request, Response } from 'express';

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
track.patch('/track/update', async (req, res) => {
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
track.delete('/track/delete/:id_work', async (req, res) => {
  const token = req.headers[authHeader] as string;
  await trackHandler.delete(token, Number(req.params.id_work));

  return res.status(200).json({ message: 'Работа удалена' });
});

// метод для проверки на текущую работу
track.get('/track/status', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await trackHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для выода списка команд
track.get('/track/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  // const { team_id } = req.body;

  const verifyWork = await trackHandler.listNoTeam(token);

  return res.status(200).json(verifyWork);
});

// метод для выода списка команд
track.get('/track/list/:team_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  // const { team_id } = req.body;
  const { team_id } = req.params;
  const teamId = parseInt(team_id, 10);

  const verifyWork = await trackHandler.list(token, teamId);

  return res.status(200).json(verifyWork);
});

// метод для вывода списка командных работ пользователя
track.get('/team/track/list/:team_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.params;
  const teamId = parseInt(team_id, 10);

  const verifyWork = await trackHandler.listTeam(token, teamId);

  return res.status(200).json(verifyWork);
});

// метод для вывода списка работ на определённое задание 
track.get('/task/track/lis/:task_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_id } = req.params;
  const taskId = parseInt(task_id, 10);

  const verifyWork = await trackHandler.listTask(token, taskId);

  return res.status(200).json(verifyWork);
});
