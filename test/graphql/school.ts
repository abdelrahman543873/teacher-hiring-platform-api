export const REGISTER_AS_SCHOOL_ADMIN = `mutation registerAsSchoolAdmin($input: RegisterAsSchoolInput!){
	response:registerAsSchoolAdmin(input: $input){
    data {
      id
      token
      slug
      email
      unverifiedPhone
      phone
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
    code
    success
    message
  }
}`;

export const COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN = `
mutation completeRegistrationAsSchoolAdmin($input: CompleteRegistrationAsSchool!)  {
  response:completeRegistrationAsSchoolAdmin(input: $input){
    data {
      id
      token
      slug
      email
      unverifiedPhone
      phone
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
        arAddress
        enAddress
        curriculums {
          id
        }
        location {
          type
          coordinates
        }
        createdAt
        updatedAt

      }
      createdAt
      updatedAt
    }
    code
    success
    message
  }
}`;

export const FIND_SCHOOL = `query findSchool($input: ID!){
  response: findSchool(id: $input){
    data {
      id
      email
      phone
      gender
      location {
        type
        coordinates
      }
      city
      createdAt
      updatedAt
      grades
      curriculums{
        id 
        enName
      }
    }
    code
    success
    message
  }
}`;
