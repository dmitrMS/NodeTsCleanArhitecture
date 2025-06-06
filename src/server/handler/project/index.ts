import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

type Project = {
  id: number;
  name: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
} | null;

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
    try{
    const verifyUser = await this.jwt.auntentification(token);

    console.log(verifyUser);
    const project = await this.db.createProject(
      verifyUser ? verifyUser.id : NaN,
      project_name
    );

    const team = await this.db.createTeam(
      verifyUser ? verifyUser.id : NaN,
      project.id
    );

    await this.db.createUserTeam(verifyUser ? verifyUser.id : NaN, team.id);
    
    return verifyUser !== null ? project : null;
  }
  catch(error) {
    throw(error);
  }
  }

  //контроллер для обновления данных о работе
  async update(token: string, project_name: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.updateProject(
          verifyUser ? verifyUser.id : NaN,
          project_name
        )
      : null;
  }

  // контроллер для удаления работы
  async delete(token: string, id_project: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.deleteProject(id_project) : null;
  }

  // контроллер для вывода списка работ пользователя
  async list(token: string): Promise<Project[] | null> {
    const verifyUser = await this.jwt.auntentification(token);

    const projects = (
      await this.db.getUsersWorkerProjects(verifyUser ? verifyUser.id : NaN)
    )?.concat(await this.db.getUsersProjects(verifyUser ? verifyUser.id : NaN));
    const projectsUnique = projects.filter(
      (project, index, self) =>
        index ===
        self.findIndex((p) => (p ? p.id : NaN) === (project ? project.id : NaN))
    );

    return verifyUser !== null ? projectsUnique : null;
  }

  // контроллер для вывода списка заданий команды
  async listTasks(token: string, project_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    interface Project {
      id: number;
      name: string;
      user_id: number;
      created_at: Date;
      updated_at: Date;
    }

    const project = (await this.db.getProjectById(project_id)) as Project;

    return verifyUser !== null ? await this.db.getProjectTasks(project) : null;
  }
}
