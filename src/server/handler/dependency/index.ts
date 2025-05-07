import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

// класс, отвечающий за работу с заданиями
export class DependencyHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер создания задания
  async create(
    token: string,
    main_task_id: number,
    dependency_task_id: number
  ) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.createDependency(main_task_id, dependency_task_id)
      : null;
  }

  //   // контроллер редактирования задания
  //   async update(token: string, task_id: number, name: string, description: string, status_id: number, begin_date: Date, end_date: Date, execute_id: number) {
  //     const verifyUser = await this.jwt.auntentification(token);

  //     return verifyUser !== null ? await this.db.updateTask(task_id, name, description, status_id, begin_date, end_date, execute_id) : null;
  //   }

  // контроллер для удаления задания
  async delete(token: string, dependency_id: number) {
    const verifyUser = await this.jwt.auntentification(token);
    // console.log(id_task);

    return verifyUser !== null
      ? await this.db.deleteDependency(dependency_id)
      : null;
  }

  // контроллер для вывода списка заданий команды
  async list(token: string, project_id: number) {
    // Проверяем авторизацию пользователя
    const verifyUser = await this.jwt.auntentification(token);
    if (!verifyUser) return null; // Если пользователь не авторизован, возвращаем null

    interface Project {
      id: number;
      name: string;
      user_id: number;
      created_at: Date;
      updated_at: Date;
    }

    // Получаем проект и его задачи
    const project = (await this.db.getProjectById(project_id)) as Project;
    const tasks = await this.db.getProjectTasks(project);
    console.log('Задачи проекта:', tasks);

    // Собираем зависимости всех задач
    let dependencies: any[] = [];
    if (tasks) {
      for (const task of tasks) {
        const taskDependencies = await this.db.getTaskDependencies(task.id);
        console.log(`Зависимости задачи ${task.id}:`, taskDependencies);
        
        if (taskDependencies) {
          dependencies.push(...taskDependencies); // Добавляем все зависимости
        }
      }
    }
    console.log('Все зависимости:', dependencies);

    return dependencies; // Явно возвращаем массив зависимостей
}

  // interface Team {
  //   id: number;
  //   name: string;
  //   admin_id: number;
  //   created_at: Date;
  //   updated_at: Date;
  // }

  // const usersTeam = await this.db.getTeamById(team_id) as Team;

  // return verifyUser !== null ? await this.db.getTeamTasks(usersTeam) : null;
}
