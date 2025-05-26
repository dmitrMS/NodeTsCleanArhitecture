import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { AuthHandler } from '../server/handler/auth/index';

export const auth = Router();
const db = new Database();
const jwt = new Jwt(db);
const authHandler = new AuthHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для регистрации пользователя
auth.post('/auth/signup', async (req, res) => {
  try{
  const { login, password } = req.body;
  const token = await authHandler.singUp(login, password);

  return res.status(200).json({
    jwt: token
  });
} catch (error)
{
  console.log(error);
  throw(error);
}});

// метод для авторизации пользователя
auth.post('/auth/signin', async (req, res) => {
  const { login, password } = req.body;
  const verifyUser = await authHandler.singIn(login, password);

  return verifyUser !== null
    ? res.status(200).json({
        jwt: verifyUser
      })
    : res.status(200).json({ message: 'Неверный логин или пароль' });
});

// метод для проверки текущей сессии
auth.post('/auth/connect', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyUser = await authHandler.connect(token);

  return verifyUser !== null
    ? res.status(200).json({
        jwt: verifyUser
      })
    : res.status(401).json();
});

// метод для получения информации о пользователе
auth.get('/auth/data', async (req, res) => {
  const token = req.headers[authHeader] as string;
  // console.log(token);console.log(req.headers);
  const verifyUser = await authHandler.getDate(token);

  return verifyUser !== null
    ? res.status(200).json({
        id: verifyUser ? verifyUser.id : NaN,
        role: verifyUser ? verifyUser.role : undefined
      })
    : res.status(401).json();
});

// вывод для получения информации об teamlead команды
auth.get('/admin/data/:admin_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  // const { admin_id } = req.body;
  const verifyUser = await authHandler.getTeamleadDate(token, Number(req.params.admin_id));

  return verifyUser !== null
    ? res.status(200).json(verifyUser)
    : res.status(401).json();
});

export default { auth };
