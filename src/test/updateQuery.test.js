import { createQuery } from '../shared/updateQuery';

describe('updateQuery', () => {
  it('createQuery creates an query', () => {
    expect([createQuery(), createQuery('12345'), createQuery('', '12345'), createQuery('123', '456')]).toEqual([
      '',
      '?account_number=12345',
      '?client_id=12345',
      '?account_number=123&client_id=456',
    ]);
  });
});
