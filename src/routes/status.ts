import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { StatusHandler } from '../server/handler/status/index';

export const status = Router();
const db = new Database();
const jwt = new Jwt(db);
const statusHandler = new StatusHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для вывода списка заданий
status.get('/status/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  
  const verifyWork = await statusHandler.list(token);

  return res.status(200).json(verifyWork);
});