import { app, server } from '../../server'
import request from 'supertest';
import mongoose from 'mongoose';

let token: string;
let _id: string;

  const mockData = {
    name: 'UnitTest',
    email: 'UnitTest@gmail.com',
    password: '123456',
    role: 'ADMIN_ROLE',
    img: '',
    blocked: 'N',
    changePassword: new Date(),
    attempts: 0
  }


describe('Generate token with valid user', () => {
  test('Get token', async () => {
    return request(app)
      .post('/api/login')
      .send('email=victor.ach94@gmail.com&password=123456') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        token = response.body.access_token;
        expect(response.status).toBe(200)
      })
      .catch(err => (err));
  });
});

describe('Users with valid token', () => {
  test('Get users', async () => {
    const result = await request(app)
      .get('/api/users/')
      .set('Authorization', token)
      .send();
    expect(result.status).toBe(200);
  });

  test('Create user (POST)', async () => {
    return await request(app)
      .post('/api/users/')
      .set('Authorization', token)
      .send(`name=${mockData.name}&email=${mockData.email}&password=${mockData.password}`) // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .expect(201)
      .then(response => {
        _id = response.body.user._id;
      })
      .catch(err => (err));
  });

  test('Force error already user created (POST)', async () => {
    const result = await request(app)
      .post('/api/users/')
      .set('Authorization', token)
      .send(`name=${mockData.name}&email=${mockData.email}&password=${mockData.password}`) // x-www-form-urlencoded upload
      .set('Accept', 'application/json');
    expect(result.status).toBe(400);
    expect(result.body.message).toBe('User already created, please try with another email.');
    expect(result.body.type).toBe('user_already_created');
  });

  test('Update mock user created', async () => {
    const nameMock = 'UpdateUnitTest';

    const result = await request(app)
      .put(`/api/users/${_id}`)
      .set('Authorization', token)
      .send(`name=${nameMock}&email=${mockData.email}&password=${mockData.password}`) // x-www-form-urlencoded upload
      .set('Accept', 'application/json');
    expect(result.status).toBe(200);
    expect(result.body.user.name).toBe(nameMock);
  });

  test('Delete mock user created', async () => {
    const result = await request(app)
      .del(`/api/users/${_id}`)
      .set('Authorization', token)
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('User deleted');
  });
});

describe('Users with invalid token', () => {
  test('Error 400 for invalid user', async () => {
    const result = await request(app)
      .post('/api/login')
      .send('email=test&password=123456') // x-www-form-urlencoded upload
      .set('Accept', 'application/json')
      .send();
    expect(result.status).toBe(400);
  });

  test('Get error 401 invalid token', async () => {
    const result = await request(app)
      .get('/api/users/')
      .set('Authorization', 'InvalidToken')
      .send();
    expect(result.status).toBe(401);
  });
});

afterAll(() => {
  mongoose.disconnect();
  server.close()
});
