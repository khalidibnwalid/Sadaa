/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type CreateRoomInput = {
  groupId: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  orderIndex: Scalars['Int']['input'];
  serverId: Scalars['UUID']['input'];
  type: Scalars['String']['input'];
};

export type CreateRoomsGroupInput = {
  name: Scalars['String']['input'];
  orderIndex: Scalars['Int']['input'];
  serverId: Scalars['UUID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
  createRoomsGroup: RoomsGroup;
  createServer: ServerMember;
  joinServer: ServerMember;
  login?: Maybe<User>;
  signup?: Maybe<User>;
  updateRoom: Room;
  updateRoomsGroup: RoomsGroup;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationCreateRoomsGroupArgs = {
  input: CreateRoomsGroupInput;
};


export type MutationCreateServerArgs = {
  input: CreateServerInput;
};


export type MutationJoinServerArgs = {
  inviteId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUpdateRoomArgs = {
  id: Scalars['UUID']['input'];
  input: UpdateRoomInput;
};


export type MutationUpdateRoomsGroupArgs = {
  id: Scalars['UUID']['input'];
  input: UpdateRoomsGroupInput;
};

export type Query = {
  __typename?: 'Query';
  room?: Maybe<Room>;
  roomsGroup: RoomsGroup;
  roomsGroups: Array<RoomsGroup>;
  server?: Maybe<Server>;
  serverMembership?: Maybe<ServerMember>;
  serverMemberships: Array<ServerMember>;
  user?: Maybe<User>;
};


export type QueryRoomArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryRoomsGroupArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryRoomsGroupsArgs = {
  serverId: Scalars['UUID']['input'];
};


export type QueryServerArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryServerMembershipArgs = {
  serverId: Scalars['UUID']['input'];
};

export type Room = {
  __typename?: 'Room';
  createdAt: Scalars['Time']['output'];
  groupId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  orderIndex: Scalars['Int']['output'];
  serverId: Scalars['UUID']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
};

export type RoomsGroup = {
  __typename?: 'RoomsGroup';
  createdAt: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  orderIndex: Scalars['Int']['output'];
  rooms: Array<Room>;
  serverId: Scalars['UUID']['output'];
  updatedAt: Scalars['Time']['output'];
};

export type Server = {
  __typename?: 'Server';
  coverUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  roomsGroups: Array<RoomsGroup>;
  updatedAt: Scalars['Time']['output'];
};

export type ServerMember = {
  __typename?: 'ServerMember';
  createdAt: Scalars['Time']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  orderIndex: Scalars['Int']['output'];
  server: Server;
  serverId: Scalars['UUID']['output'];
  updatedAt: Scalars['Time']['output'];
  userId: Scalars['UUID']['output'];
};

export type UpdateRoomInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  orderIndex?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoomsGroupInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  orderIndex?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  updatedAt: Scalars['Time']['output'];
  username: Scalars['String']['output'];
};

export type CreateServerInput = {
  coverUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type LoginInput = {
  credential: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type SignUpMutationVariables = Exact<{
  input: SignupInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signup?: { __typename?: 'User', id: any, email: string, username: string } | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: any, email: string, username: string } | null };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: any, email: string, username: string } | null };

export type RoomsGroupsQueryVariables = Exact<{
  serverId: Scalars['UUID']['input'];
}>;


export type RoomsGroupsQuery = { __typename?: 'Query', roomsGroups: Array<{ __typename?: 'RoomsGroup', id: any, name: string, rooms: Array<{ __typename?: 'Room', id: any, name: string, groupId: any, type: string }> }> };

export type ServerMembershipsQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerMembershipsQuery = { __typename?: 'Query', serverMemberships: Array<{ __typename?: 'ServerMember', userId: any, serverId: any, nickname?: string | null, server: { __typename?: 'Server', id: any, name: string, coverUrl?: string | null } }> };


export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"signupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"loginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const RoomsGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoomsGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomsGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<RoomsGroupsQuery, RoomsGroupsQueryVariables>;
export const ServerMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerMemberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverMemberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"server"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}}]}}]}}]}}]} as unknown as DocumentNode<ServerMembershipsQuery, ServerMembershipsQueryVariables>;