import { type CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URL,
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: [
    'src/libs/graphql/**/*.ts',
    'src/libs/graphql/server.ts', // for some reason it completely ignored this file, so I had to add it explicitly
    'src/libs/graphql/rooms.ts'
  ],
  generates: {
    './src/__generated__/gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;