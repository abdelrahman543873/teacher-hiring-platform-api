export const SEND_VERIFICATION_CODE = `mutation sendPhoneVerificationCode($updatedPhone: String) {
  response:sendPhoneVerificationCode(updatedPhone:$updatedPhone) {
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
          arName
        }
        grades
        curriculums{
          id
          enName
          arName
        }
        createdAt
        updatedAt 
      }
      lastLoginDetails {
        lastLoginAt
        lastLoginDevice
        platformDetails
      }
      school{
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
    }
    code
    success
    message
  }
}`;

export const VERIFY_PHONE_VERIFICATION_CODE = `
  mutation verifyPhoneVerificationCode($code: String!) {
    response: verifyPhoneVerificationCode(code: $code) {
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
          subjects {
            id
          }
          grades
          curriculums {
            id
          }
          createdAt
          updatedAt
        }
        lastLoginDetails {
          lastLoginAt
          lastLoginDevice
          platformDetails
        }
        school{
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
          curriculums {
            id
          }
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
      }
      code
      success
      message
    }
  }
`;

export const SEND_RESET_PASSWORD_CODE = `mutation sendResetPasswordCode($phone: String!) {
  response:sendResetPasswordCode(phone:$phone) {
      data 
      code
      success
      message
  }
}`;

export const RESET_PASSWORD_BY_PHONE = `mutation resetPasswordByPhone($input: ResetPasswordByPhoneInput!) {
  response:resetPasswordByPhone(input:$input) {
      data{
        id
        firstName
        phone
      }
      code
      success
      message
  }
}`;

export const VERIFY_RESET_PASSWORD_VERIFICATION_CODE = `mutation verifyResetPasswordVerificationCode($input: VerifyResetPasswordVerificationCode!) {
  response:verifyResetPasswordVerificationCode(input:$input) {
      data
      code
      success
      message
  }
}`;

export const LOGOUT = `mutation logout($input: DeviceEnum!) {
  response: logout(device: $input) {
      data
      code
      success
      message
  }
}`;
