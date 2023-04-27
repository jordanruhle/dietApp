const request = require('supertest');
const app = require('../server'); // Import your app

describe('User Routes', () => {
  let userId;

  beforeAll(async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      password: 'testpassword',
      confirmPassword: 'testpassword',
    };

    const res = await request(app).post('/api/users').send(newUser);
    userId = res.body.user._id;
  });

  afterAll(async () => {
    await request(app).delete(`/api/users/delete/${userId}`);
  });

  it('POST /api/users', async () => {
    const newUser = {
      firstName: 'Test 2',
      lastName: 'User 2',
      email: 'test2.user@example.com',
      password: 'testpassword2',
      confirmPassword: 'testpassword2',
    };
  
    const res = await request(app).post('/api/users').send(newUser);
    expect(res.status).toEqual(200);
    expect(res.body.msg).toEqual('success!');
    expect(res.body.user).toHaveProperty('_id');
  
    // Clean up by deleting the created user
    await request(app).delete(`/api/users/delete/${res.body.user._id}`);
  });

  it('GET /api/users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
  });

  it('GET /api/users/find/:id', async () => {
    const res = await request(app).get(`/api/users/find/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('_id', userId);
  });

  it('POST /api/users/login', async () => {
    const credentials = {
      email: 'test.user@example.com',
      password: 'testpassword',
    };

    const res = await request(app).post('/api/users/login').send(credentials);
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('login succesful');
  });

  it('DELETE /api/users/delete/:id', async () => {
    const res = await request(app).delete(`/api/users/delete/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('User deleted successfully');
    expect(res.body.result).toHaveProperty('deletedCount', 1);
  });
});
