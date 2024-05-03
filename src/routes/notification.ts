import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { NotificationHandler } from '../server/handler/notification/index';

export const notification = Router();
const db = new Database();
const jwt = new Jwt(db);
const notificationHandler = new NotificationHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для обновления данных уведомления
notification.put('/notification/update', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { notification_id, team_id } = req.body;
  const verifyWork = await notificationHandler.updateTeam(
    token,
    notification_id,
    team_id
  );

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для удаления уведомления
notification.delete('/notification/delete/:notification_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await notificationHandler.delete(token, Number(req.params.notification_id));

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода списка уведомлений
notification.get('/notification/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await notificationHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});
