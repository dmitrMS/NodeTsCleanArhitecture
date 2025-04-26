import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

// класс для работы с рабочим временем
export class ProjectHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер для начала работы пользователя
  async create(token: string, project_name: string, user_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.createProject(
          verifyUser ? verifyUser.id : NaN,
          project_name,
        )
      : null;
  }

  //контроллер для обновления данных о работе
  async update(
    token: string,
    project_name: string,
  ) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.updateProject(
          verifyUser ? verifyUser.id : NaN,
          project_name,
        )
      : null;
  }

  // контроллер для удаления работы
  async delete(token: string, id_project: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.deleteProject(id_project) : null;
  }

//   // контроллер для проверки неоконченной работы
//   async status(token: string) {
//     const verifyUser = await this.jwt.auntentification(token);

//     return verifyUser !== null
//       ? await this.db.getProjectStatus(verifyUser ? verifyUser.id : NaN)
//       : null;
//   }

  // контроллер для вывода списка работ пользователя
  async list(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ?  await this.db.getUsersProjects(verifyUser ? verifyUser.id : NaN)
      : null;
  }
}