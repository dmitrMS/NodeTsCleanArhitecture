import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Database {

  constructor() {}

  async getUnfinishedWorkTime(id: number) {
    const verifyWork = await prisma.work_time.findFirst({
      where: {
        user_id: id,
        end_date: null
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getUsersWorkTimes(id: number) {
    const verifyWork = await prisma.work_time.findMany({
      where: {
        user_id: id,
        task_id: null
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getUsersTeamWorkTimes(id: number,team_id: number) {
    const usersTasks=await this.getTeamTasksById(team_id);
    let teamWorkTimes=[];
    for (const element of usersTasks) 
    {
      const verifyWork = await prisma.work_time.findMany({
        where: {
          user_id: id,
          task_id:element.id
        }
      });
      for (const item of verifyWork) 
      {
        teamWorkTimes.push(item);
      }
    }

    return teamWorkTimes;
  }

  async getManuUsersTeamWorkTimes(team_id: number) {
    const usersTasks=await this.getTeamTasksById(team_id);
    let teamWorkTimes=[];
    for (const element of usersTasks) 
    {
      const verifyWork = await prisma.work_time.findMany({
        where: {
          task_id:element.id
        }
      });
      for (const item of verifyWork) 
      {
        teamWorkTimes.push(item);
      }
    }

    return teamWorkTimes;
  }

  async beginWorkTime(id: number, task_name:string,task_id: number) {
    const verifyWork = await new Database().getUnfinishedWorkTime(id);

    if (verifyWork === null) {
      let result={};
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

  async updateWorkTime(id: number, id_work: number, task_name:string, begin_time:Date, end_time:Date) {
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

  async deleteWorkTime(id_work: number) {
    await prisma.work_time.delete({
      where: {
        id: id_work
      }
    });

    return null;
  }

  async findUserByLogin(login:string) {
    const result = await prisma.user.findFirst({
      where: {
        login: login
      }
    });

    return result;
  }

  async findUserById(id:number) {
    const result = await prisma.user.findFirst({
      where: {
        id: id
      }
    });

    return result;
  }

  async createUserToken(login:string, password:string) {
    const result = await new Database().findUserByLogin(login);

    return result && bcrypt.compareSync(password, result.password)
      ? result
      : null;
  }

  async createUser(login:string, password:string) {
    let salt = await bcrypt.genSalt(10);
    const result = await prisma.user.create({
      data: {
        login: login,
        password: await bcrypt.hash(password, salt),
        role: 'user'
      }
    });

    return result;
  }

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

  async createTask(name : string, team_id: number) {
    const result = await prisma.task.create({
      data: {
        name: name,
        team_id: team_id
      }
    });

    return result;
  }

  async deleteTask(task_id: number) {
    await prisma.task.delete({
      where: {
        id: task_id
      }
    });

    return null;
  }

  async getTasks(id: number) {
    const verifyWork = await prisma.task.findMany({
      where: {
        team_id: id,
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async createTeam(id: number, name:string) {
    const result = await prisma.team.create({
      data: {
        admin_id: id,
        name: name
      }
    });

    return result;
  }

  async deleteTeam(team_id: number) {
    await prisma.team.delete({
      where: {
        id: team_id
      }
    });

    return null;
  }

  async getTeams(id: number) {
    const verifyWork = await prisma.team.findFirst({
      where: {
        id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getTeamById(id : number) {
    const verifyWork = await prisma.team.findFirst({
      where: {
        id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getUsersTeams(id : number) {
    const teamUsers = await prisma.user_team.findMany({
      where: {
        user_id: id
      }
    });
    let userTeams = [];

    for (const element of teamUsers) {
      const item = await new Database().getTeams(element.team_id);
      userTeams.push(item);
    }

    return userTeams;
  }

  async getTeamsTasks(usersTeams : { id: number;name: string; admin_id: number; created_at: Date; updated_at: Date; } []) {
    let teamsTasks: { id: number;name: string; team_id: number; created_at: Date; updated_at: Date; }[] = [];
    for (const element of usersTeams) {
      teamsTasks = await prisma.task.findMany({
        where: {
          team_id: element.id
        }
      });
    }

    return teamsTasks;
  }

  async getTeamTasks(userTeam : { id: number;name: string; admin_id: number; created_at: Date; updated_at: Date; }) {
    const teamTasks = await prisma.task.findMany({
      where: {
        team_id: userTeam.id
      }
    });

    return teamTasks;
  }

  async getTeamTasksById(team_id : number) {
    const teamTasks = await prisma.task.findMany({
      where: {
        team_id: team_id
      }
    });

    return teamTasks;
  }

  async createNotification(id : number, user_id : number, team_id : number) {
    const result = await prisma.notification.create({
      data: {
        sender_id: id,
        user_id: user_id,
        reason: 'team',
        data_id: team_id
      }
    });

    return result;
  }

  async deleteNotification(id : number) {
    await prisma.team.delete({
      where: {
        id: id
      }
    });

    return null;
  }

  async updateStatusNotification(id : number) {
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

  async getUncoordinatedNotifications(id : number) {
    const verifyWork = await prisma.notification.findMany({
      where: {
        user_id: id,
        status: false
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getAllNotifications(id : number) {
    const verifyWork = await prisma.notification.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async createUserTeam(user_id : number, team_id : number) {
    const result = await prisma.user_team.create({
      data: {
        user_id: user_id,
        team_id: team_id
      }
    });

    return result;
  }

  // async deleteUserTeam(user_id: number, team_id: number) {
  //   await prisma.user_team.delete({
  //     where: {
  //       user_id: user_id,
  //       team_id: team_id
  //     }
  //   });

  //   return null;
  // }

  async getUsersTeam(team_id : number) {
    const verifyWork = await prisma.user_team.findMany({
      where: {
        team_id: team_id
      }
    });

    return verifyWork;
  }
}

export default prisma;
