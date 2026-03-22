import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { MailService } from '../src/modules/mail/mail.service';

describe('Auth E2E (AuthModule)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockMailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue('http://mock-verification-url'),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService) // prevent real emails
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = app.get(JwtService);
    usersService = app.get(UsersService);

    // Reset the database
    const dataSource = app.get(DataSource);
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
      );
    }
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
    expect(registerResponse.body.verification_url).toBe('http://mock-verification-url');

    const verificationToken = registerResponse.body.access_token;

    // 2️⃣ Verify email
    await request(app.getHttpServer())
      .get(`/auth/verify-email?token=${verificationToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe('Email verified successfully!');
      });

    // Confirm in DB
    const user = await usersService.findByEmail(registerDto.email);
    expect(user.emailVerified).toBe(true);

    // 3️⃣ Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: registerDto.email, password: registerDto.password })
      .expect(201);

    const jwt = loginResponse.body.access_token;
    expect(jwt).toBeDefined();

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