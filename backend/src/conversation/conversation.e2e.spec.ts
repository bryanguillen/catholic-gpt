import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationModule } from './conversation.module';
import { Conversation } from './conversation.entity';
import { AppUser } from '../app-user/app-user.entity';
import { AppUserService } from '../app-user/app-user.service';

describe('ConversationController (e2e)', () => {
  let app: INestApplication;
  let appUserService: AppUserService;
  let appUserRepository: Repository<AppUser>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Conversation, AppUser],
          synchronize: true,
        }),
        ConversationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    appUserService = moduleFixture.get<AppUserService>(AppUserService);
    appUserRepository = moduleFixture.get<Repository<AppUser>>(
      getRepositoryToken(AppUser),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/conversation (POST) - success', async () => {
    const appUserId = 'valid-app-user-id';
    // Insert a test AppUser into the database
    const testUser = appUserRepository.create({ id: appUserId });
    await appUserRepository.save(testUser);

    // Mock the appUserService to return a valid user
    jest
      .spyOn(appUserService, 'getAppUser')
      .mockResolvedValue({ id: appUserId, conversations: [] } as AppUser);

    const response = await request(app.getHttpServer())
      .post('/conversation')
      .send({ appUserId })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });

  test('/conversation (POST) - app user not found', async () => {
    const appUserId = 'invalid-app-user-id';
    // Mock the appUserService to return null, simulating a non-existent user
    jest.spyOn(appUserService, 'getAppUser').mockResolvedValue(null);

    await request(app.getHttpServer())
      .post('/conversation')
      .send({ appUserId })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'App user not found',
        error: 'Not Found',
      });
  });
});
