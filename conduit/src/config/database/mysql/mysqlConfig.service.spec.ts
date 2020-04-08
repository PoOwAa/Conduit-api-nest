import { Test, TestingModule } from '@nestjs/testing';
import { MysqlConfigService } from './mysqlConfig.service';

describe('MysqlConfigService', () => {
  let service: MysqlConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MysqlConfigService],
    }).compile();

    service = module.get<MysqlConfigService>(MysqlConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
