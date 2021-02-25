export const CITIES = `
query cities{
  response: cities{
    code
    success
    message
    data
  }
}
`;

export const FIND_USER = `
query findUser($id: String!){
  response: findUser(id: $id){
    code
    success
    message
    data
    {
      id
      firstName
      lastName
      unverifiedPhone
      slug
      email
      status
      isEmailVerified
      gender
      city
      favLang
      isComplete
    }
  }
}
`;

export const USERS = `
query users{
  response: users{
    code
    success
    message
    data
    {
      id
      firstName
      lastName
      unverifiedPhone
      slug
      email
      status
      isEmailVerified
      gender
      city
      favLang
      isComplete
    }
  }
}
`;
