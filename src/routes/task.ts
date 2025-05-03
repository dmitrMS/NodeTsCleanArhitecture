import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { TaskHandler } from '../server/handler/task/index';

export const task = Router();
const db = new Database();
const jwt = new Jwt(db);
const taskHandler = new TaskHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для создания командного задания
task.post('/task/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { name, project_id } = req.body;
  const verifyWork = await taskHandler.create(token, name, project_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для создания командного задания
task.patch('/task/update', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_id, name,description, status_id, begin_date, end_date } = req.body;
  const verifyWork = await taskHandler.update(token,task_id, name, description, status_id, begin_date, end_date);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для удаления задания
task.delete('/task/delete/:task_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await taskHandler.delete(token, Number(req.params.task_id));

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода списка заданий
task.get('/task/list/:team_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.params;
  const teamId = parseInt(team_id, 10);
  
  const verifyWork = await taskHandler.list(token, teamId);

  return res.status(200).json(verifyWork);
});
