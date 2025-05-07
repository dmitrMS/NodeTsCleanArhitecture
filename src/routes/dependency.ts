import { Router } from 'express';
import { Jwt } from '../DAL/jwt';
import { Database } from '../BLL/database';
import { DependencyHandler } from '../server/handler/dependency/index';

export const dependency = Router();
const db = new Database();
const jwt = new Jwt(db);
const dependencyHandler = new DependencyHandler(db, jwt);
const authHeader = 'x-auth-key';

// метод для создания командного задания
dependency.post('/dependency/create', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const { main_task_id, dependency_task_id } = req.body;
  const verifyWork = await dependencyHandler.create(token, main_task_id, dependency_task_id);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// // метод для создания командного задания
// task.patch('/task/update', async (req, res) => {
//   const token = req.headers[authHeader] as string;
//   const { task_id, name,description, status_id, begin_date, end_date, executor_id } = req.body;
//   const verifyWork = await taskHandler.update(token,task_id, name, description, status_id, begin_date, end_date, executor_id);

//   return verifyWork !== null
//     ? res.status(200).json(verifyWork)
//     : res.status(200).json(null);
// });

// метод для удаления задания
dependency.delete('/dependency/delete/:dependency_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
  const verifyWork = await dependencyHandler.delete(token, Number(req.params.dependency_id));

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

// метод для вывода списка заданий
dependency.get('/dependency/list/:project_id', async (req, res) => {
  const token = req.headers[authHeader] as string;
//   const { dependency_id } = req.params;
//   const dependencyId = parseInt(dependency_id, 10);
  
  const verifyWork = await dependencyHandler.list(token, Number(req.params.project_id));
  console.log(verifyWork);

  return res.status(200).json(verifyWork);
});
