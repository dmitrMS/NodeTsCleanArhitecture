export class User {
    public id: number;
    public login: string;
    public password: string;
    public role: string;
    public created_at: Date;
    public updated_at: Date;
  
    constructor(user: { id: number; login: string; password: string; role: string; created_at: Date; updated_at: Date;}) {
      this.id = user.id;
      this.login = user.login;
      this.password = user.password;
      this.role = user.role;
      this.created_at = user.created_at;
      this.updated_at = user.updated_at;
    }
  }