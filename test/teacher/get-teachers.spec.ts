import { post } from '../request';
import { GET_TEACHERS } from '../graphql/teacher';
import { rollbackDbForTeacher } from './rollback-for-teacher';
import { generateSchoolAdminData } from '../auth/generate-auth-data';
import { StatusEnum } from 'src/user/user.enum';
import * as cites from '../eg-cities.json';
import { generateTeachersWithOrderedCities } from './generate-teacher-data';
import { ArrayOFCitesClosestToDamietta } from '../constants';

describe('Get_Teachers_Suite_Test', () => {
  afterEach(async () => {
    await rollbackDbForTeacher();
  });

  it('returns_teachers_with_correct_order_based_on_school_admin_location_with_no_filter_input', async () => {
    const schoolCity = cites.find(({ city }) => city === 'Damietta');

    const { admin } = await generateSchoolAdminData({
      admin: {
        status: StatusEnum.ACCEPTED
      },
      school: {
        location: {
          type: 'Point',
          coordinates: [schoolCity.lng, schoolCity.lat]
        }
      }
    });

    const createdTeachers = await generateTeachersWithOrderedCities({
      user: { status: StatusEnum.ACCEPTED }
    });

    const res = await post({
      query: GET_TEACHERS,
      variables: {
        input: {
          limit: ArrayOFCitesClosestToDamietta.length,
          page: 1
        }
      },
      token: admin.token
    });
    const {
      code,
      data: { items }
    } = res.body.data.response;

    expect(code).toBe(200);
    createdTeachers.forEach((createdTeacher, index) => {
      expect(createdTeacher.user.dataValues.id).toBe(items[index].id);
    });
  });

  it('returns_teachers_with_correct_order_based_on_school_admin_location_with_max_distance_only', async () => {
    const schoolCity = cites.find(({ city }) => city === 'Damietta');

    const { admin } = await generateSchoolAdminData({
      admin: {
        status: StatusEnum.ACCEPTED
      },
      school: {
        location: {
          type: 'Point',
          coordinates: [schoolCity.lng, schoolCity.lat]
        }
      }
    });

    const createdTeachers = await generateTeachersWithOrderedCities({
      user: { status: StatusEnum.ACCEPTED }
    });

    const res = await post({
      query: GET_TEACHERS,
      variables: {
        input: {
          limit: ArrayOFCitesClosestToDamietta.length,
          page: 1,
          filterBy: {
            max_distance: 50
          }
        }
      },
      token: admin.token
    });
    const {
      code,
      data: { items }
    } = res.body.data.response;
    const createdTeacherThatWasUnder50Km = createdTeachers[0].user.dataValues; //portSaid

    expect(code).toBe(200);
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(createdTeacherThatWasUnder50Km.id);
    expect(items[0].awayFromCurrentUserBy).toBeLessThanOrEqual(50);
  });

  it('returns_teachers_with_correct_order_based_on_school_admin_location_with_max_distance_and_lat_long_only', async () => {
    const schoolCity = cites.find(({ city }) => city === 'Damietta');
    const latLongPoint = cites.find(({ city }) => city === 'Ismailia');

    const { admin } = await generateSchoolAdminData({
      admin: {
        status: StatusEnum.ACCEPTED
      },
      school: {
        location: {
          type: 'Point',
          coordinates: [schoolCity.lng, schoolCity.lat]
        }
      }
    });

    const createdTeachers = await generateTeachersWithOrderedCities({
      user: { status: StatusEnum.ACCEPTED }
    });

    const res = await post({
      query: GET_TEACHERS,
      variables: {
        input: {
          limit: ArrayOFCitesClosestToDamietta.length,
          page: 1,
          filterBy: {
            max_distance: 50
          },
          lat: Number(latLongPoint.lat),
          long: Number(latLongPoint.lng)
        }
      },
      token: admin.token
    });
    const {
      code,
      data: { items }
    } = res.body.data.response;

    expect(code).toBe(200);
    const createdTeacherThatWasUnder50Km = createdTeachers[1].user.dataValues; //Ismailia
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(createdTeacherThatWasUnder50Km.id);
  });

  it('returns_teachers_with_correct_order_based_on_school_admin_location_with_lat_long_only', async () => {
    const schoolCity = cites.find(({ city }) => city === 'Ismailia');
    const latLongPoint = cites.find(({ city }) => city === 'Damietta');

    const { admin } = await generateSchoolAdminData({
      admin: {
        status: StatusEnum.ACCEPTED
      },
      school: {
        location: {
          type: 'Point',
          coordinates: [schoolCity.lng, schoolCity.lat]
        }
      }
    });

    const createdTeachers = await generateTeachersWithOrderedCities({
      user: { status: StatusEnum.ACCEPTED }
    });

    const res = await post({
      query: GET_TEACHERS,
      variables: {
        input: {
          limit: ArrayOFCitesClosestToDamietta.length,
          page: 1,
          lat: Number(latLongPoint.lat),
          long: Number(latLongPoint.lng)
        }
      },
      token: admin.token
    });

    const {
      code,
      data: { items }
    } = res.body.data.response;

    expect(code).toBe(200);
    createdTeachers.forEach((createdTeacher, index) => {
      expect(createdTeacher.user.dataValues.id).toBe(items[index].id);
    });
  });
});
