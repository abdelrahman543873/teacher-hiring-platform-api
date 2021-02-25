import { post } from '../request';
import { rollbackDbForSubject } from './rollback-for-subject';
import { SubjectFactory } from '../../src/subject/subject.factory';
import { FIND_SUBJECT } from '../graphql/subject';

describe('find subject', () => {
  afterEach(async () => {
    await rollbackDbForSubject();
  });

  it('return_correct_record_using_find', async () => {
    const subject = await SubjectFactory();
    const res = await post({ query: FIND_SUBJECT, variables: { id: subject.id } });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.id).toEqual(subject.id);
  });
});
