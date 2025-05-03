import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { ProjectHandler } from '../server/handler/project/index';
// import { Request, Response } from 'express';

export const project = Router();
const db = new Database();
const jwt = new Jwt(db);
const projectHandler = new ProjectHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод чтобы создать проект
project.post('/project/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { project_name, user_id } = req.body;
  const result = await projectHandler.create(token, project_name, user_id);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json(null);
});

// метод для изменения проекта
project.patch('/project/update', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { project_name} = req.body;
  const result = await projectHandler.update(
    token,
    project_name,
  );

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

// сетод для удаления проекта
project.delete('/project/delete/:id_project', async (req, res) => {
  const token = req.headers[authHeader] as string;
  await projectHandler.delete(token, Number(req.params.id_project));

  return res.status(200).json({ message: 'Проект удалён' });
});

// // метод для проверки статуса текущего проекта
// project.get('/project/status', async (req, res) => {
//   const token = req.headers[authHeader] as string;
//   const verifyWork = await trackHandler.status(token);

//   return verifyWork !== null
//     ? res.status(200).json(verifyWork)
//     : res.status(200).json(null);
// });

// метод для вывода списка проектов
project.get('/project/list', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await projectHandler.list(token);

  return res.status(200).json(verifyWork);
});

// метод для вывода списка заданий
project.get('/project/tasks/list/:project_id', async (req, res) => {
  const token = req.headers[authHeader] as string;

  const verifyWork = await projectHandler.listTasks(token, Number(req.params.project_id));

  return res.status(200).json(verifyWork);
});