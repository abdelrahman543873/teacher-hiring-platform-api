export const LOGIN = `
mutation login($loginInput: PhoneAndPasswordLoginInput!){
  response: login(loginInput: $loginInput){
    code
    success
    message
    data{
      firstName
      lastName
      slug
      token
      status
      isEmailVerified
      phone
      gender
      birthDate
      role
      location{
        coordinates
      }
      city
      isBlocked
      favLang
      token
    }
  }
}
`;
