import {PersonNamesPipe} from './person-names.pipe';

describe('PersonNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new PersonNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
