import * as request from 'supertest';
import { app } from './before-test-run';

interface IPOST {
  query: string;
  variables?: Record<string, any>;
  token?: string;
  headers?: Record<string, any>;
}
export async function post({ query, variables, token, headers }: IPOST): Promise<request.Response> {
  const req = request(app.getHttpServer())
    .post('/graphql')
    .send({ query, ...(variables && { variables }) });

  if (token) req.set('Authorization', `Bearer ${token}`);
  if (headers) {
    if (headers.timezone) return req.set('timezone', headers.timezone);
    if (headers.lang) return req.set('lang', headers.lang);
  }

  return await req;
}
