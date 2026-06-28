import { Test, TestingModule } from '@nestjs/testing';
import { SrsService } from './srs.service';

describe('SrsService', () => {
  let service: SrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SrsService],
    }).compile();

    service = module.get<SrsService>(SrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
