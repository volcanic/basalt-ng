import { DigestModule } from './digest.module';

describe('DigestModule', () => {
  let digestModule: DigestModule;

  beforeEach(() => {
    digestModule = new DigestModule();
  });

  it('should create an instance', () => {
    expect(digestModule).toBeTruthy();
  });
});
