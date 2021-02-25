export const GET_TEACHERS = `
query Teachers($input: GetTeachersInput!){
  response: Teachers(input:$input){
    data {
      items {
      id
      token
      slug
      email
      lastName
      unverifiedPhone
      phone
      awayFromCurrentUserBy
      rejectionReasons
      email
      status
      isEmailVerified
      phone
      gender
      birthDate
      role
      location {
        type
        coordinates
      }
      city
      profilePicture
      isBlocked
      favLang
      securityGroup {
        id
        groupName
        description
        permissions
      }
      notificationManager {
        VIA_EMAIL
        VIA_PUSH
      }
      createdAt
      updatedAt
      teacher {
        teacherId
        experience
        subjects{
          id
          enName
        }
        grades
        curriculums{
          id 
          enName
        }
        createdAt
        updatedAt
      }
      lastLoginDetails {
        lastLoginAt
        lastLoginDevice
        platformDetails
      }
      school {
        id
        schoolAdminId
        name
        phone
        landlineNumber
        email
        schoolType
        city
        profilePicture
        grades
        gender
         certificates
        location {
          type
          coordinates
        }
        createdAt
        updatedAt

      }
      createdAt
      updatedAt
      isComplete
    
      }
    }
    code
    success
    message
  }
}
`;

export const CHOOSE_TEACHER_SUBJECT = `
mutation chooseTeacherSubject($teacherId: ID!, $subjectId: ID!){
  response: chooseTeacherSubject(teacherId: $teacherId, subjectId: $subjectId){
    code
    success
    message
    data
    {
        id
        enName
        arName
        arDescription
        enDescription
    }
  }
}
`;

export const CHOOSE_TEACHER_CURRICULUM = `
mutation chooseTeacherCurriculum($teacherId: ID!, $curriculumId: ID!){
  response: chooseTeacherCurriculum(teacherId: $teacherId, curriculumId: $curriculumId){
    code
    success
    message
    data
    {
        id
        enName
        arName
        arDescription
        enDescription
    }
  }
}
`;

export const CREATE_TEACHER = `
mutation registerAsTeacher($input: registerAsTeacherInput!){
  response: registerAsTeacher(input: $input){
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
      token
    }
  }
}
`;

export const COMPLETE_TEACHER_PROFILE = `
mutation completeTeacherProfile($input: CompleteTeacherRegisterationInput! ){
  response: completeTeacherProfile(input: $input ){
    code
    success
    message
    data
    {
      teacherId
      experience
      grades
      curriculums{
        enName
        arName
      }
      subjects{
        enName
        arName
      }
      cv
      idDocument
      certificates
    }
  }
}
`;
