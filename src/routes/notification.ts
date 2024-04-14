import { Router } from 'express';
import { Jwt } from '../jwt';
import { Database } from '../database';
import { NotificationHandler } from '../server/handler/notification/index';

export const notification = Router();
const db = new Database();
const jwt = new Jwt(db);
const notificationHandler = new NotificationHandler(db, jwt);
const authHeader = 'x-auth-key';

notification.post('/notification/update', async (req, res) => {
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

notification.post('/notification/delete', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { notification_id } = req.body;
  const verifyWork = await notificationHandler.delete(token, notification_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

notification.post('/notification/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await notificationHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});
