/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation SignUp($input: signupInput!) {\n    signup(input: $input) {\n      id\n      email\n      username\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  mutation Login($input: loginInput!) {\n    login(input: $input) {\n      id\n      email\n      username\n    }\n  }\n": typeof types.LoginDocument,
    "\n  query User {\n    user {\n      id\n      email\n      username\n    }\n  }\n": typeof types.UserDocument,
    "\n\tmutation CreateRoom($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\torderIndex\n\t\t\tgroupId\n\t\t\tserverId\n\t\t\ttype\n\t\t\tname\n\t\t}\n\t}\n": typeof types.CreateRoomDocument,
    "\n\tquery RoomsGroups($serverId: UUID!) {\n\t\troomsGroups(serverId: $serverId) {\n\t\t\tid\n\t\t\tname\n\t\t\trooms { \n\t\t\t\tid \n\t\t\t\tname \n\t\t\t\tgroupId \n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n": typeof types.RoomsGroupsDocument,
    "\n\tmutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {\n\t\tcreateRoomsGroup(input: $input) {\n\t\t\tid\n\t\t\tname\n\t\t\torderIndex\n\t\t\tserverId\n\t\t}\n\t}\n": typeof types.CreateRoomsGroupDocument,
    "\n  query ServerMemberships {\n    serverMemberships {\n      userId\n      serverId\n      nickname\n      server { \n        id\n        name\n        coverUrl\n      }\n    }\n  }\n": typeof types.ServerMembershipsDocument,
};
const documents: Documents = {
    "\n  mutation SignUp($input: signupInput!) {\n    signup(input: $input) {\n      id\n      email\n      username\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation Login($input: loginInput!) {\n    login(input: $input) {\n      id\n      email\n      username\n    }\n  }\n": types.LoginDocument,
    "\n  query User {\n    user {\n      id\n      email\n      username\n    }\n  }\n": types.UserDocument,
    "\n\tmutation CreateRoom($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\torderIndex\n\t\t\tgroupId\n\t\t\tserverId\n\t\t\ttype\n\t\t\tname\n\t\t}\n\t}\n": types.CreateRoomDocument,
    "\n\tquery RoomsGroups($serverId: UUID!) {\n\t\troomsGroups(serverId: $serverId) {\n\t\t\tid\n\t\t\tname\n\t\t\trooms { \n\t\t\t\tid \n\t\t\t\tname \n\t\t\t\tgroupId \n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n": types.RoomsGroupsDocument,
    "\n\tmutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {\n\t\tcreateRoomsGroup(input: $input) {\n\t\t\tid\n\t\t\tname\n\t\t\torderIndex\n\t\t\tserverId\n\t\t}\n\t}\n": types.CreateRoomsGroupDocument,
    "\n  query ServerMemberships {\n    serverMemberships {\n      userId\n      serverId\n      nickname\n      server { \n        id\n        name\n        coverUrl\n      }\n    }\n  }\n": types.ServerMembershipsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignUp($input: signupInput!) {\n    signup(input: $input) {\n      id\n      email\n      username\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp($input: signupInput!) {\n    signup(input: $input) {\n      id\n      email\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($input: loginInput!) {\n    login(input: $input) {\n      id\n      email\n      username\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: loginInput!) {\n    login(input: $input) {\n      id\n      email\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query User {\n    user {\n      id\n      email\n      username\n    }\n  }\n"): (typeof documents)["\n  query User {\n    user {\n      id\n      email\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateRoom($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\torderIndex\n\t\t\tgroupId\n\t\t\tserverId\n\t\t\ttype\n\t\t\tname\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateRoom($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\torderIndex\n\t\t\tgroupId\n\t\t\tserverId\n\t\t\ttype\n\t\t\tname\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery RoomsGroups($serverId: UUID!) {\n\t\troomsGroups(serverId: $serverId) {\n\t\t\tid\n\t\t\tname\n\t\t\trooms { \n\t\t\t\tid \n\t\t\t\tname \n\t\t\t\tgroupId \n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomsGroups($serverId: UUID!) {\n\t\troomsGroups(serverId: $serverId) {\n\t\t\tid\n\t\t\tname\n\t\t\trooms { \n\t\t\t\tid \n\t\t\t\tname \n\t\t\t\tgroupId \n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {\n\t\tcreateRoomsGroup(input: $input) {\n\t\t\tid\n\t\t\tname\n\t\t\torderIndex\n\t\t\tserverId\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {\n\t\tcreateRoomsGroup(input: $input) {\n\t\t\tid\n\t\t\tname\n\t\t\torderIndex\n\t\t\tserverId\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ServerMemberships {\n    serverMemberships {\n      userId\n      serverId\n      nickname\n      server { \n        id\n        name\n        coverUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query ServerMemberships {\n    serverMemberships {\n      userId\n      serverId\n      nickname\n      server { \n        id\n        name\n        coverUrl\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;