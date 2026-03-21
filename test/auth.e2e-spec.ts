import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('Auth E2E (AuthModule)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = app.get(JwtService);
    usersService = app.get(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('register → verify → login → checkAuth', async () => {
    // 1️⃣ Register
    const registerDto = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: '1234',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    expect(registerResponse.body.user).toBeDefined();
    expect(registerResponse.body.access_token).toBeDefined();
    expect(registerResponse.body.verification_url).toBeDefined();

    // Extract verification token from URL (simulate real flow)
    const verificationToken = registerResponse.body.access_token;

    // 2️⃣ Verify email
    await request(app.getHttpServer())
      .get(`/auth/verify-email?token=${verificationToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe('Email verified successfully!');
      });

    // Optionally check that user is marked verified in DB
    const user = await usersService.findByEmail(registerDto.email);
    expect(user.emailVerified).toBe(true);

    // 3️⃣ Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: registerDto.email, password: registerDto.password })
      .expect(201);

    expect(loginResponse.body.access_token).toBeDefined();
    const jwt = loginResponse.body.access_token;

    // 4️⃣ checkAuth
    await request(app.getHttpServer())
      .get('/auth/check')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toBe(registerDto.email);
      });
  });
});