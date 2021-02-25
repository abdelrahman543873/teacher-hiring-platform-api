export const SUBJECTS = `
query Subjects{
  response: Subjects{
    code
    success
    message
    data{
      id
      enName
      arName
      enDescription
      arDescription
    }
  }
}
`;

export const CREATE_SUBJECT = `
mutation createSubject($input: SubjectInput!){
  response: createSubject(input: $input){
    code
    success
    message
    data{
      id
      enName
      arName
      enDescription
      arDescription
    }
  }
}
`;

export const UPDATE_SUBJECT = `
mutation updateSubject($input: UpdateSubjectInput!){
  response: updateSubject(input: $input){
    code
    success
    message
    data{
      id
      enName
      arName
      enDescription
      arDescription
    }
  }
}
`;

export const FIND_SUBJECT = `
query findSubject($id: ID!){
  response: findSubject(id: $id){
    code
    success
    message
    data{
      id
      enName
      arName
      enDescription
      arDescription
    }
  }
}
`;

export const DELETE_SUBJECT = `
mutation deleteSubject($id:ID!){
  response: deleteSubject(id:$id){
    code
    success
    message
  }
}
`;
