import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { TeamHandler } from '../server/handler/team/index';

export const team = Router();
const db = new Database();
const jwt = new Jwt(db);
const teamHandler = new TeamHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для создания команды
team.post('/team/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { name } = req.body;
  const verifyWork = await teamHandler.create(token, name);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для удаления команды
team.post('/team/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await teamHandler.delete(token, team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода списка команд пользователя
team.post('/team/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await teamHandler.list(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода информации о команде
team.post('/team/info', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { team_id } = req.body;
  const verifyWork = await teamHandler.info(token,team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для добавления командного пользователя
team.post('/team/add_user', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { login, team_id } = req.body;
  const verifyWork = await teamHandler.addUserTeam(token, login, team_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});
