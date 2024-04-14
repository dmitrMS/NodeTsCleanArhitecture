import { Router } from 'express';
import { Jwt } from '../jwt';
import { Database } from '../database';
import { TaskHandler } from '../server/handler/task/index';

export const task = Router();
const db = new Database();
const jwt = new Jwt(db);
const taskHandler = new TaskHandler(db, jwt);
const authHeader = 'x-auth-key';

task.post('/task/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { name, team_id } = req.body;
  const verifyWork = await taskHandler.create(token, name, team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

task.post('/task/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { task_id } = req.body;
  const verifyWork = await taskHandler.delete(token, task_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

task.post('/task/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await taskHandler.list(token, team_id);

  return res.status(200).json(verifyWork);
});
