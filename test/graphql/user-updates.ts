export const UPDATE_USER_STATUS = `
mutation updateUserStatus($input: UpdateUserStatusInput!){
  response: updateUserStatus(input: $input){
    code
    success
    message
    data
    {
        id
        firstName
        lastName
        status
    }
  }
}
`;

export const VIEW_USERS_REQUESTS = `
query viewUserRequests ($input: ViewUsersRequestsInput!){
  response:viewUserRequests(input:$input){
    data {
      items {
        id
        role
      }
      pageInfo {
        totalCount
      }
    }
    code
    success
    message
  }
}
`;
