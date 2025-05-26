import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database'; 

// класс, отвечающий за работу с пользователем
export class AuthHandler {
  db: Database;
  jwt: Jwt;
  constructor(db: Database, jwt : Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер для авторизации
  async singIn(login:string, password:string) {
    const verifyUser = await this.db.createUserToken(login, password);

    return verifyUser !== null ? this.jwt.createToken(verifyUser.id,verifyUser.role) : null;
  }

  // контроллер для регистрации
  async singUp(login:string, password:string) {
    try{
      const user = await this.db.createUser(login, password);
      return this.jwt.createToken(user.id,user.role);
    }
    catch (error)
    {
      console.log('error',error);
    }
  }

  // контроллер для проверки открытой сессии
  async connect(token:string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? this.jwt.createToken(verifyUser ? verifyUser.id : NaN, verifyUser ? verifyUser.role : undefined) : null;
  }

  // контроллер для вывода данных об пользователе
  async getDate(token:string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? verifyUser : null;
  }

    // контроллер для вывода данных об teamlead
  async getTeamleadDate(token:string,admin_id: number) {
    await this.jwt.auntentification(token);
    const verifyUser = await this.db.findUserById(admin_id);

    return verifyUser !== null ? verifyUser : null;
  }
}
