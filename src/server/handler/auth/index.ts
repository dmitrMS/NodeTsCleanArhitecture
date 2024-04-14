import { Jwt } from '../../../jwt';
import { Database } from '../../../database'; 

export class AuthHandler {
  db: Database;
  jwt: Jwt;
  constructor(db: Database, jwt : Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async singIn(login:string, password:string) {
    const verifyUser = await this.db.createUserToken(login, password);

    return verifyUser !== null ? this.jwt.createToken(verifyUser.id,verifyUser.role) : null;
  }

  async singUp(login:string, password:string) {
    const user = await this.db.createUser(login, password);

    return this.jwt.createToken(user.id,user.role);
  }

  async connect(token:string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? this.jwt.createToken(verifyUser ? verifyUser.id : NaN, verifyUser ? verifyUser.role : undefined) : null;
  }

  async getDate(token:string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? verifyUser : null;
  }
}
