import { gql } from "@/__generated__/gql";

export const SIGNUP_MUTATION = gql(`
  mutation SignUp($input: signupInput!) {
    signup(input: $input) {
      id
      email
      username
    }
  }
`);

export const LOGIN_MUTATION = gql(`
  mutation Login($input: loginInput!) {
    login(input: $input) {
      id
      email
      username
    }
  }
`);

export const USER_QUERY = gql(`
  query User {
    user {
      id
      email
      username
    }
  }
`);
