import { Test, TestingModule } from '@nestjs/testing';
import { PasswordApiService } from './password-api.service';

describe('PasswordApiService', () => {
  let service: PasswordApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordApiService],
    }).compile();

    service = module.get<PasswordApiService>(PasswordApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
