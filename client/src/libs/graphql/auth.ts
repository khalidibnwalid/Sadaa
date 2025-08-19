import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: signupInput!) {
    signup(input: $input) {
      id
      email
      username
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: loginInput!) {
    login(input: $input) {
      id
      email
      username
    }
  }
`;