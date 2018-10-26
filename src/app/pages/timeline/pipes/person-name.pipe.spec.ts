import {PersonNamePipe} from './person-names.pipe';

describe('PersonNamePipe', () => {
  it('create an instance', () => {
    const pipe = new PersonNamePipe();
    expect(pipe).toBeTruthy();
  });
});
