import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { SchemaLink } from 'apollo-link-schema';
import merge from 'lodash.merge';
import gql from 'graphql-tag';
import createCache from './createCache';

import schemaDeps from '../../../__generated__/schemaDeps';

const clientSchemaModules = schemaDeps.map(([module]) => module).filter(m => m.clientSchema);
const clientSchema = gql(clientSchemaModules.map(m => m.clientSchema).join('\n'));
const clientDefaults = merge.apply(null, [{}, ...clientSchemaModules.map(m => m.defaults || {})]);
const clientResolvers = merge.apply(null, [{}, ...clientSchemaModules.map(m => m.resolvers)]);

export default function createApolloClient(
  schema: SchemaLink.Options,
  partialCacheDefaults: Object,
) {
  const cache = createCache();

  cache.writeData({
    data: merge({}, clientDefaults, partialCacheDefaults),
  });

  const link = from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.warn(`[Network error]: ${networkError}`);
    }),
    new SchemaLink({ ...schema }),
  ]);

  return new ApolloClient({
    // @ts-ignore
    link,
    cache,
    typeDefs: clientSchema,
    resolvers: clientResolvers,
    ssrMode: true,
    queryDeduplication: true,
  });
}
