import { Router } from 'express';
import { Jwt } from '../jwt';
import { Database } from '../database';
import { UserTeamHandler } from '../server/handler/user_team/index';

export const user_team = Router();
const db = new Database();
const jwt = new Jwt(db);
const userTeamHandler = new UserTeamHandler(db, jwt);
const authHeader = 'x-auth-key';

user_team.post('/user_team/list', async (req, res) => {
    const token = req.headers[authHeader] as string;
    const { team_id } = req.body;
    const verifyWork = await userTeamHandler.list(token,team_id);
  
    return verifyWork !== null
      ? res.status(200).json(verifyWork)
      : res.status(200).json(null);
  });