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
  const { name, project_id } = req.body;
  const verifyWork = await teamHandler.create(token, project_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для удаления команды
team.delete('/team/delete/:team_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await teamHandler.delete(token, Number(req.params.team_id));

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода списка команд пользователя
team.get('/team/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await teamHandler.list(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода информации о команде
team.get('/team/info', async (req, res) => {
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
  const { login, project_id, project_name } = req.body;
  const verifyWork = await teamHandler.addUserTeam(token, login, project_id, project_name);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});
