import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { UserTeamHandler } from '../server/handler/user_team/index';

export const user_team = Router();
const db = new Database();
const jwt = new Jwt(db);
const userTeamHandler = new UserTeamHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для удаления участника из команды
user_team.delete('/user_team/delete/:user_id/:team_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await userTeamHandler.delete(token,Number(req.params.user_id),Number(req.params.team_id));

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода списка участников команды
user_team.get('/user_team/list/:project_id', async (req, res) => {
    const token = req.headers[authHeader] as string;
    // const { team_id } = req.body;
    const verifyWork = await userTeamHandler.list(token,Number(req.params.project_id));
  
    return verifyWork !== null
      ? res.status(200).json(verifyWork)
      : res.status(200).json(null);
  });