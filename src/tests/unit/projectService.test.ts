import { ProjectHandler } from '../../server/handler/project';
import { Database } from '../../BLL/database';
import { Jwt } from '../../DAL/jwt';

const mockUser = { id: 1, role: 'user' };

const mockProject = {
  id: 101,
  name: 'Test Project',
  user_id: 1,
  created_at: new Date(),
  updated_at: new Date()
};

const mockTeam = {
  id: 201,
  project_id: 101,
  admin_id: 1,
  created_at: new Date('2020-01-01'),
  updated_at: new Date('2020-01-01')
};

const mockTask = {
  id: 1,
  name: 'Test Task',
  description: null,
  status_id: null,
  priority_id: null,
  project_id: 1,
  begin_date: null,
  end_date: null,
  author_id: 1,
  executor_id: null,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockUserTeam = {
  id: 1,
  user_id: 1,
  role_id: 1,
  team_id: 201,
  created_at: new Date(),
  updated_at: new Date(),
};

jest.mock('../../BLL/database', () => ({
  Database: jest.fn().mockImplementation(() => ({
    createProject: jest.fn(),
    createTeam: jest.fn(),
    createUserTeam: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    getUsersProjects: jest.fn(),
    getUsersWorkerProjects: jest.fn(),
    getProjectById: jest.fn(),
    getProjectTasks: jest.fn()
  }))
}));

jest.mock('../../DAL/jwt', () => ({
  Jwt: jest.fn().mockImplementation(() => ({
    auntentification: jest.fn()
  }))
}));

describe('ProjectHandler', () => {
  let db: jest.Mocked<Database>;
  let jwt: jest.Mocked<Jwt>;
  let handler: ProjectHandler;

  beforeEach(() => {
    db = new Database() as jest.Mocked<Database>;
    jwt = new Jwt(db) as jest.Mocked<Jwt>;
    handler = new ProjectHandler(db, jwt);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create project, team, and userTeam', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.createProject.mockResolvedValue(mockProject);
      db.createTeam.mockResolvedValue(mockTeam);
      db.createUserTeam.mockResolvedValue(mockUserTeam);

      const result = await handler.create('token123', 'Test Project', mockUser.id);

      expect(jwt.auntentification).toHaveBeenCalledWith('token123');
      expect(db.createProject).toHaveBeenCalledWith(mockUser.id, 'Test Project');
      expect(db.createTeam).toHaveBeenCalledWith(mockUser.id, mockProject.id);
      expect(db.createUserTeam).toHaveBeenCalledWith(mockUser.id, mockTeam.id);
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('should update project if authenticated', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.updateProject.mockResolvedValue(mockProject);

      const result = await handler.update('token', 'Updated Name');

      expect(result).toEqual(mockProject);
      expect(db.updateProject).toHaveBeenCalledWith(mockUser.id, 'Updated Name');
    });

    it('should return null if not authenticated', async () => {
      jwt.auntentification.mockResolvedValue(null);
      const result = await handler.update('token', 'New Name');

      expect(result).toBeNull();
      expect(db.updateProject).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete project if authenticated', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.deleteProject.mockResolvedValue(null);

      const result = await handler.delete('token', mockProject.id);
      expect(result).toBeNull();
      expect(db.deleteProject).toHaveBeenCalledWith(mockProject.id);
    });

    it('should return null if not authenticated', async () => {
      jwt.auntentification.mockResolvedValue(null);

      const result = await handler.delete('token', mockProject.id);
      expect(result).toBeNull();
    });
  });

  describe('list', () => {
    it('should return unique list of projects', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.getUsersProjects.mockResolvedValue([mockProject]);
      db.getUsersWorkerProjects.mockResolvedValue([mockProject]);

      const result = await handler.list('token');

      expect(result).toEqual([mockProject]);
      expect(db.getUsersProjects).toHaveBeenCalled();
      expect(db.getUsersWorkerProjects).toHaveBeenCalled();
    });
  });

  describe('listTasks', () => {
    it('should return tasks if authenticated', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.getProjectById.mockResolvedValue(mockProject);
      db.getProjectTasks.mockResolvedValue([mockTask]);

      const result = await handler.listTasks('token', mockProject.id);
      expect(result).toEqual([mockTask]);
    });

    it('should return null if not authenticated', async () => {
      jwt.auntentification.mockResolvedValue(null);

      const result = await handler.listTasks('token', mockProject.id);
      expect(result).toBeNull();
    });
  });
});
