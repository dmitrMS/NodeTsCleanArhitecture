import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { RoleHandler } from '../server/handler/role/index';

export const role = Router();
const db = new Database();
const jwt = new Jwt(db);
const roleHandler = new RoleHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для вывода списка заданий
role.get('/role/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  
  const verifyWork = await roleHandler.list(token);

  return res.status(200).json(verifyWork);
});