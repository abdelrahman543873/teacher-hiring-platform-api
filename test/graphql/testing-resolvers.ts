export const CREATE_ADMIN_TOKEN = `
mutation createAdminToken{
  response: createAdminToken{
    code
    success
    message
    data
  }
}
`;

export const CREATE_FAKE_USERS = `
mutation{
  response: createFakeUsers{
    data{
        id
        firstName
        lastName
        token
    }
    code
    success
    message
  }
}
`;

export const GET_ADMIN_TOKEN = `
query{
  response: getAdminToken{
    code
    success
    message
  }
}`;
