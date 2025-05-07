import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { PriorityHandler } from '../server/handler/priority/index';

export const priority = Router();
const db = new Database();
const jwt = new Jwt(db);
const priorityHandler = new PriorityHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для вывода списка заданий
priority.get('/priority/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  
  const verifyWork = await priorityHandler.list(token);

  return res.status(200).json(verifyWork);
});