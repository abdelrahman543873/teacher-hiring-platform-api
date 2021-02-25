import { post } from '../request';
import { SUBJECTS } from '../graphql/subject';
import { SubjectsFactory } from '../../src/subject/subject.factory';
import { rollbackDbForSubject } from './rollback-for-subject';
describe('return all subjects', () => {
  afterEach(async () => {
    await rollbackDbForSubject();
  });

  it('return_correct_records_using_find', async () => {
    await SubjectsFactory();
    const res = await post({ query: SUBJECTS });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.length).toBeGreaterThan(0);
  });
});
