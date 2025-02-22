import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserModule } from './app-user.module';
import { AppUser } from './app-user.entity';
import { Conversation } from '../conversation/conversation.entity';

describe('AppUserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [AppUser, Conversation],
          synchronize: true,
        }),
        AppUserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/app-user (POST)', () => {
    const userId = 'test-uuid';
    return request(app.getHttpServer())
      .post('/app-user')
      .send({ userId })
      .expect(201)
      .expect({ id: userId });
  });
});
