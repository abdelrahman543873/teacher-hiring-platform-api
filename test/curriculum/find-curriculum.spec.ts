import { post } from '../request';
import { FIND_CURRICULUM } from '../graphql/curriculum';
import { CurriculumFactory } from '../../src/curriculum/curriculum.factory';
import { rollbackDbForCurriculum } from './rollback-for-curriculum';
import { CurriculumRepository } from '../../src/curriculum/curriculum.repository';

describe('find curriculum', () => {
  afterEach(async () => {
    await rollbackDbForCurriculum();
  });

  it('return_correct_record_using_find', async () => {
    const curriculum = await CurriculumFactory();
    const res = await post({ query: FIND_CURRICULUM, variables: { input: curriculum.id } });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.id).toEqual(curriculum.id);
  });

  it('error_if_record_doesot_exist', async () => {
    const curriculum = (await CurriculumFactory()).id;
    const curriculumRepo = new CurriculumRepository();
    await curriculumRepo.rawDelete();
    const res = await post({ query: FIND_CURRICULUM, variables: { input: curriculum } });
    expect(res.body.data.response.code).toBe(646);
  });
});
