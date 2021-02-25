import { post } from '../request';
import { FIND_CURRICULUMS } from '../graphql/curriculum';
import { rollbackDbForCurriculum } from './rollback-for-curriculum';
import { CurriculumsFactory } from '../../src/curriculum/curriculum.factory';

describe('find curriculums', () => {
  afterEach(async () => {
    await rollbackDbForCurriculum();
  });

  it('return_correct_records_using_find', async () => {
    await CurriculumsFactory();
    const res = await post({ query: FIND_CURRICULUMS });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.length).toBeGreaterThan(0);
  });
});
