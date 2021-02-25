export const FIND_CURRICULUM = `
query findCurriculum($input: ID!){
  response: findCurriculum(id: $input){
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

export const FIND_CURRICULUMS = `
query Curriculums{
  response: Curriculums{
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

export const CREATE_CURRICULUM = `
mutation createCurriculum($input: CurriculumInput!){
  response: createCurriculum(input: $input){
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

export const UPDATE_CURRICULUM = `
mutation updateCurriculum($input: UpdateCurriculumInput!){
  response: updateCurriculum(input: $input){
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

export const DELETE_CURRICULUM = `
mutation deleteCurriculum($id:ID!){
  response: deleteCurriculum(id:$id){
    code
    success
    message
  }
}
`;
