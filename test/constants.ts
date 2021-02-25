import * as faker from 'faker';

export const NOT_EXISTED_UUID = faker.random.uuid();

export const PHONE = '+201099988877';

export const OTHER_PHONE = '+201099955511';

export const NOT_VALID_PHONE = '+2055511';

export const VERIFICATION_CODE = '1234';

export const OTHER_VERIFICATION_CODE = '5678';

export const PASSWORD = '123456';

export const OTHER_PASSWORD = '123456789';

export const EMAIL = 'email@em.com';

export const PAST_TIME = new Date().getTime() - 3600;

export const SUPER_ADMIN_GROUP = 'SuperAdmin';

export const ArrayOFCitesClosestToDamietta = [
  {
    city: 'Port Said',
    lat: '31.2500',
    lng: '32.2833',
    country: 'Egypt',
    iso2: 'EG',
    admin_name: 'B\u016br Sa\u2018\u012bd',
    capital: 'admin',
    population: '524433',
    population_proper: '524433'
  },
  {
    city: 'Ismailia',
    lat: '30.5833',
    lng: '32.2667',
    country: 'Egypt',
    iso2: 'EG',
    admin_name: 'Al Ism\u0101\u2018\u012bl\u012byah',
    capital: 'admin',
    population: '293184',
    population_proper: '293184'
  },
  {
    city: 'Cairo',
    lat: '30.0561',
    lng: '31.2394',
    country: 'Egypt',
    iso2: 'EG',
    admin_name: 'Al Q\u0101hirah',
    capital: 'primary',
    population: '19372000',
    population_proper: '9500000'
  },
  {
    city: 'Luxor',
    lat: '25.6969',
    lng: '32.6422',
    country: 'Egypt',
    iso2: 'EG',
    admin_name: 'Al Uq\u015fur',
    capital: 'admin',
    population: '202232',
    population_proper: '202232'
  }
];
