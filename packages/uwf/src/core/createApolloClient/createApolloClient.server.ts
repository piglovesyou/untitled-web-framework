import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { SchemaLink } from 'apollo-link-schema';
import merge from 'lodash.merge';
import gql from 'graphql-tag';
import createCache from './createCache';

import schemaDeps from '../../../__generated__/clientSchemaDeps';

const clientSchema = gql(schemaDeps.map(([m]) => m.schema).join('\n'));
const clientDefaults = merge.apply(null, [{}, ...schemaDeps.map(([m]) => m.defaults).filter(Boolean)]);
const clientResolvers = merge.apply(null, [{}, ...schemaDeps.map(([m]) => m.resolvers).filter(Boolean)]);

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
