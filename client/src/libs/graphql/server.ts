import { gql } from "@/__generated__/gql";

export const SERVER_MEMBERSHIPS_QUERY = gql(`
  query ServerMemberships {
    serverMemberships {
      userId
      serverId
      nickname
      server { 
        id
        name
        coverUrl
      }
    }
  }
`);
