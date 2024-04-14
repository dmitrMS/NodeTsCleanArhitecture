import { Router } from 'express';
import { Jwt } from '../jwt';
import { Database } from '../database';
import { AuthHandler } from '../server/handler/auth/index';

export const auth = Router(); 
const db = new Database();
const jwt = new Jwt(db);
const authHandler = new AuthHandler(db, jwt);
const authHeader = 'x-auth-key';

auth.post('/auth/signup', async (req, res) => {
    const { login, password } = req.body;
    const token = await authHandler.singUp(login, password);
  
    return res.status(200).json({
      jwt: token
    });
  });
  
  auth.post('/auth/signin', async (req, res) => {
    const { login, password } = req.body;
    const verifyUser = await authHandler.singIn(login, password);
  
    return verifyUser !== null
      ? res.status(200).json({
          jwt: verifyUser
        })
      : res.status(200).json({ message: 'Неверный логин или пароль' });
  });
  
  auth.post('/auth/connect', async (req, res) => {
    const token = req.headers[authHeader] as string;
    const verifyUser = await authHandler.connect(token);
  
    return verifyUser !== null
      ? res.status(200).json({
          jwt: verifyUser
        })
      : res.status(401).json();
  });
  
  auth.post('/auth/data', async (req, res) => {
    const token = req.headers[authHeader] as string;
    const verifyUser = await authHandler.getDate(token);
  
    return verifyUser !== null
      ? res.status(200).json({
          id: verifyUser? verifyUser.id : NaN,
          role: verifyUser ? verifyUser.role : undefined
        })
      : res.status(401).json();
  });

  module.exports = {auth};