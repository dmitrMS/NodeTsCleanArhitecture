import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// класс с методами бизнес логики
export class Database {
  constructor() {}

  // проверка наличия незаконченной работы
  async getUnfinishedWorkTime(id: number) {
    const verifyWork = await prisma.work_time.findFirst({
      where: {
        user_id: id,
        end_date: null
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // вывод работ отдельного пользователя
  async getUsersWorkTimes(id: number) {
    const verifyWork = await prisma.work_time.findMany({
      where: {
        user_id: id,
        task_id: null
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // // вывод всех командных работ отдельного пользователя
  // async getUsersTeamWorkTimes(id: number, team_id: number) {
  //   const usersTasks = await this.getTeamTasksById(team_id);
  //   let teamWorkTimes = [];
  //   for (const element of usersTasks) {
  //     const verifyWork = await prisma.work_time.findMany({
  //       where: {
  //         user_id: id,
  //         task_id: element.id
  //       }
  //     });
  //     for (const item of verifyWork) {
  //       teamWorkTimes.push(item);
  //     }
  //   }

  //   return teamWorkTimes;
  // }

  // // вывод всех работ в отдельной команде
  // async getManuUsersTeamWorkTimes(team_id: number) {
  //   const usersTasks = await this.getTeamTasksById(team_id);
  //   let teamWorkTimes = [];
  //   for (const element of usersTasks) {
  //     const verifyWork = await prisma.work_time.findMany({
  //       where: {
  //         task_id: element.id
  //       }
  //     });
  //     for (const item of verifyWork) {
  //       teamWorkTimes.push(item);
  //     }
  //   }

  //   return teamWorkTimes;
  // }

  // вывод всех работ пользователя по отдельному командному заданию
  async getManuUsersTaskWorkTimes(task_id: number) {
    const verifyWork = await prisma.work_time.findMany({
      where: {
        task_id: task_id
      }
    });

    return verifyWork;
  }

  // начать работу
  async beginWorkTime(id: number, task_name: string, task_id: number) {
    const verifyWork = await new Database().getUnfinishedWorkTime(id);

    if (verifyWork === null) {
      let result = {};
      if (task_id == null) {
        result = await prisma.work_time.create({
          data: {
            user_id: id,
            begin_date: new Date().toISOString(),
            task_name: task_name
          }
        });
      } else {
        result = await prisma.work_time.create({
          data: {
            user_id: id,
            begin_date: new Date().toISOString(),
            task_name: task_name,
            task_id: task_id
          }
        });
      }

      return result;
    }

    return null;
  }

  // закончить работу
  async finishWorkTime(id: number) {
    const verifyWork = await new Database().getUnfinishedWorkTime(id);

    if (verifyWork !== null) {
      const result = await prisma.work_time.update({
        where: {
          id: verifyWork.id
        },
        data: {
          end_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });

      return result;
    }

    return null;
  }

  // обновить данные в работе
  async updateWorkTime(
    id: number,
    id_work: number,
    task_name: string,
    begin_time: Date,
    end_time: Date
  ) {
    const result = await prisma.work_time.update({
      where: {
        id: id_work
      },
      data: {
        begin_date: begin_time,
        end_date: end_time,
        task_name: task_name
      }
    });

    return result;
  }

  // удалить работу
  async deleteWorkTime(id_work: number) {
    await prisma.work_time.delete({
      where: {
        id: id_work
      }
    });

    return null;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // создать задание
  async createProject(user_id: number, project_name: string) {
    const result = await prisma.project.create({
      data: {
        name: project_name,
        user_id: user_id
      }
    });

    return result;
  }

  // обновить рабочее время по заданию
  async updateProject(project_id: number, project_name: string) {
    const result = await prisma.project.update({
      where: {
        id: project_id
      },
      data: {
        name: project_name
      }
    });

    return result;
  }

  // удалить работу
  async deleteProject(id_project: number) {
    await prisma.project.delete({
      where: {
        id: id_project
      }
    });

    return null;
  }

  async getUsersProjects(id: number) {
    const verifyWork = await prisma.project.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // найти проект по идентификатору
  async getProjectById(id: number) {
    const verifyWork = await prisma.project.findFirst({
      where: {
        id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // вывод списка заданий отдельной команды отдельного пользователя
  async getProjectTasks(userProject: {
    id: number;
    name: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
  }) {
    try {
      const teamProjects = await prisma.task.findMany({
        where: {
          project_id: userProject.id
        }
      });

      return teamProjects;
    } catch {
      return null;
    }
  }

  // вывод всех статусов
  async getStatus() {
    const verifyWork = await prisma.status.findMany({});

    return verifyWork;
  }

  // вывод всех статусов
  async getRole() {
    const verifyWork = await prisma.role.findMany({});

    return verifyWork;
  }

  // вывод всех приоритетов
  async getPriority() {
    const verifyWork = await prisma.priority.findMany({});

    return verifyWork;
  }

  // вывод команды по проекту
  async getProjectTeam(project_id: number) {
    const verifyWork = await prisma.team.findFirst({
      where: {
        project_id: project_id
      }
    });

    return verifyWork;
  }

  async getUsersWorkerProjects(id: number) {
    const teamUsers = await prisma.user_team.findMany({
      where: {
        user_id: id
      }
    });
    let userTeams = [];

    for (const element of teamUsers) {
      const item = await new Database().getTeamById(element.team_id);
      userTeams.push(item);
    }

    let userProjects = [];

    for (const element of userTeams) {
      const item = await new Database().getProjectById(
        element ? element.project_id : NaN
      );
      userProjects.push(item);
    }

    return userProjects;
  }

  // создать зависимость
  async createDependency(main_task_id: number, dependency_task_id: number) {
    const result = await prisma.dependency.create({
      data: {
        main_task_id: main_task_id,
        dependency_task_id: dependency_task_id
      }
    });

    return result;
  }

  // удалить зависимость
  async deleteDependency(dependency_id: number) {
    await prisma.dependency.delete({
      where: {
        id: dependency_id
      }
    });

    return null;
  }

  async getTaskDependencies(main_task_id: number) {
    const verifyWork = await prisma.dependency.findMany({
      where: {
        main_task_id: main_task_id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  ///////////////////////////////////////////////////////////////////

  // найти пользователя по логину
  async findUserByLogin(login: string) {
    const result = await prisma.user.findFirst({
      where: {
        login: login
      }
    });

    return result;
  }

  // найти пользователя по идентификатору
  async findUserById(id: number) {
    const result = await prisma.user.findFirst({
      where: {
        id: id
      }
    });

    return result;
  }

  // создать jwt токен для пользователя
  async createUserToken(login: string, password: string) {
    const result = await new Database().findUserByLogin(login);

    return result && bcrypt.compareSync(password, result.password)
      ? result
      : null;
  }

  // регистрация пользователя
  async createUser(login: string, password: string) {
    try{
      console.log('log4');
    let salt = await bcrypt.genSalt(10);
    console.log('log5');
    const result = await prisma.user.create({
      data: {
        login: login,
        password: await bcrypt.hash(password, salt),
        role: 'user'
      }
    });

    return result;
  } catch (error)
  {
    console.log('log7');
    console.log(error);
    throw(error);
  }
  }

  // обновить рабочее время по заданию
  async updateUser(id: number, task_id: number) {
    const result = await prisma.work_time.update({
      where: {
        id: id
      },
      data: {
        task_id: task_id
      }
    });

    return result;
  }

  // создать задание
  async createTask(name: string, project_id: number, author_id: number) {
    const result = await prisma.task.create({
      data: {
        name: name,
        // team_id: team_id,
        project_id: project_id,
        author_id: author_id
      }
    });

    return result;
  }

  // обновить задание
  async updateTask(
    task_id: number,
    name: string,
    description: string,
    status_id: number,
    priority_id: number,
    begin_date: Date,
    end_date: Date,
    executor_id: number
  ) {
    const result = await prisma.task.update({
      where: {
        id: task_id
      },
      data: {
        name: name,
        // team_id: team_id,
        description: description,
        status_id: status_id,
        priority_id: priority_id,
        begin_date: begin_date,
        end_date: end_date,
        executor_id: executor_id
      }
    });

    return result;
  }

  // удалить задание
  async deleteTask(task_id: number) {
    await prisma.task.delete({
      where: {
        id: task_id
      }
    });

    return null;
  }

  // // вывести список заданий в отдельной команде
  // async getTasks(id: number) {
  //   const verifyWork = await prisma.task.findMany({
  //     where: {
  //       team_id: id
  //     }
  //   });

  //   return verifyWork !== null ? verifyWork : null;
  // }

  // создать команду
  async createTeam(id: number, project_id: number) {
    const result = await prisma.team.create({
      data: {
        admin_id: id,
        project_id: project_id
      }
    });

    return result;
  }

  // удалить команду
  async deleteTeam(team_id: number) {
    await prisma.team.delete({
      where: {
        id: team_id
      }
    });

    return null;
  }

  // найти команду по идентификатору
  async getTeamById(id: number) {
    const verifyWork = await prisma.team.findFirst({
      where: {
        id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // вывести список команд отдельного пользователя
  async getUsersTeams(id: number) {
    const teamUsers = await prisma.user_team.findMany({
      where: {
        user_id: id
      }
    });
    let userTeams = [];

    for (const element of teamUsers) {
      const item = await new Database().getTeamById(element.team_id);
      userTeams.push(item);
    }

    return userTeams;
  }

  // вывести список заданий команд, в которых состоит teamlead
  async getTeamsTasks(
    usersTeams: {
      id: number;
      name: string;
      admin_id: number;
      created_at: Date;
      updated_at: Date;
    }[]
  ) {
    let teamsTasks: {
      id: number;
      name: string;
      team_id: number;
      created_at: Date;
      updated_at: Date;
    }[] = [];
    //////////////////////////////////////////////////////////////////////////консервация
    // for (const element of usersTeams) {
    //   teamsTasks = await prisma.task.findMany({
    //     where: {
    //       team_id: element.id
    //     }
    //   });
    // }

    return teamsTasks;
  }

  // // вывод списка заданий отдельной команды отдельного пользователя
  // async getTeamTasks(userTeam: {
  //   id: number;
  //   name: string;
  //   admin_id: number;
  //   created_at: Date;
  //   updated_at: Date;
  // }) {
  //   try {
  //     const teamTasks = await prisma.task.findMany({
  //       where: {
  //         team_id: userTeam.id
  //       }
  //     });

  //     return teamTasks;
  //   } catch {
  //     return null;
  //   }
  // }

  // // вывод списка заданий команды
  // async getTeamTasksById(team_id: number) {
  //   const teamTasks = await prisma.task.findMany({
  //     where: {
  //       team_id: team_id
  //     }
  //   });

  //   return teamTasks;
  // }

  // создание уведомления
  async createNotification(
    id: number,
    user_id: number,
    project_id: number,
    project_name: string
  ) {
    const result = await prisma.notification.create({
      data: {
        sender_id: id,
        user_id: user_id,
        reason: project_name,
        data_id: project_id
      }
    });

    return result;
  }

  // удаление уведомления
  async deleteNotification(id: number) {
    await prisma.notification.delete({
      where: {
        id: id
      }
    });

    return null;
  }

  // обновление статуса уведомления
  async updateStatusNotification(id: number) {
    const result = await prisma.notification.update({
      where: {
        id: id
      },
      data: {
        status: true
      }
    });

    return result;
  }

  // вывод списка уведомлений без ответа
  async getUncoordinatedNotifications(id: number) {
    const verifyWork = await prisma.notification.findMany({
      where: {
        user_id: id,
        status: false
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // вывод списка всех уведомлений
  async getAllNotifications(id: number) {
    const verifyWork = await prisma.notification.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  // создать участника команды
  async createUserTeam(user_id: number, team_id: number) {
    const result = await prisma.user_team.create({
      data: {
        user_id: user_id,
        team_id: team_id,
        role_id: 1
      }
    });

    return result;
  }

  // удалить участника команды
  async deleteUserTeam(user_team_id: number) {
    interface user_team {
      id: number;
      user_id: number;
      team_id: number;
      created_at: Date;
      updated_at: Date;
    }
    
    await prisma.user_team.delete({
      where: {
        id: user_team_id
      }
    });

    return null;
  }

  //вывод пользователей команды
  async getUsersTeam(team_id: number) {
    const verifyWork = await prisma.user_team.findMany({
      where: {
        team_id: team_id
      }
    });

    return verifyWork;
  }

  async getUserTeamById(user_team_id: number) {
    const verifyWork = await prisma.user_team.findFirst({
      where: {
        id: user_team_id
      }
    });

    return verifyWork;
  }

  //вывод пользователей команды
  async updateUsersTeam(user_team_id: number, role_id: number) {
    const verifyWork = await prisma.user_team.update({
      where: {
        id: user_team_id
      },
      data: {
        role_id: role_id
      }
    });

    // console.log(verifyWork);
    return verifyWork;
  }

  //вывод пользователей команды
  async usersTeamRole(user_id: number, team_id: number) {
    const verifyWork = await prisma.user_team.findFirst({
      where: {
        user_id: user_id,
        team_id: team_id
      },
    });

    // console.log(verifyWork);
    return verifyWork;
  }

  // //вывод пользователей команды
  // async getUsersWorkerProjects(id: number) {
  //   const verifyWork = await prisma.user_team.findMany({
  //     where: {
  //       user_id: id
  //     }
  //   });

  //   return verifyWork;
  // }
}

export default prisma;
