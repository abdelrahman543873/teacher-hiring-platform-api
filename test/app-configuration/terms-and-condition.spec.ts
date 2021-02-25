import { AppConfigurationFactory } from 'src/app-configuration/app-configuration.factory';
import { TERMS_AND_CONDITIONS } from '../graphql/app-configuration';
import { post } from '../request';
import { rollbackDbForAppConfiguration } from './rollback-for-app-configuration';

describe('Terms and conditions', () => {
  afterEach(async () => {
    await rollbackDbForAppConfiguration();
  });

  it('return_terms_based_on_lang_header', async () => {
    const enTerms = await AppConfigurationFactory(false, { key: 'enTerms', value: 'en' });
    const arTerms = await AppConfigurationFactory(false, { key: 'arTerms', value: 'ar' });

    const res1 = await post({ query: TERMS_AND_CONDITIONS, headers: { lang: 'eg-en' } });
    expect(res1.body.data.response.data).toBe(enTerms.value);

    const res2 = await post({ query: TERMS_AND_CONDITIONS, headers: { lang: 'eg-ar' } });
    expect(res2.body.data.response.data).toBe(arTerms.value);
  });
});
