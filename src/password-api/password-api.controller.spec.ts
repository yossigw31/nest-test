import { Test, TestingModule } from '@nestjs/testing';
import { PasswordApiController } from './password-api.controller';

describe('PasswordApiController', () => {
  let controller: PasswordApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordApiController],
    }).compile();

    controller = module.get<PasswordApiController>(PasswordApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
