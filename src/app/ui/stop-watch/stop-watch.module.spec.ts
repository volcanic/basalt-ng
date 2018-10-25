import { StopWatchModule } from './stop-watch.module';

describe('StopWatchModule', () => {
  let stopWatchModule: StopWatchModule;

  beforeEach(() => {
    stopWatchModule = new StopWatchModule();
  });

  it('should create an instance', () => {
    expect(stopWatchModule).toBeTruthy();
  });
});
