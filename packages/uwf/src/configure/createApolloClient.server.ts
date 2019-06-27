import { ApolloClient, Resolvers } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { SchemaLink } from 'apollo-link-schema';
import { DocumentNode } from "graphql";
import merge from 'lodash.merge';
import { ApolloCache } from 'apollo-cache';

type ServerApolloClientArgs = {
  schemaArgs: SchemaLink.Options,
  partialCacheDefaults: Object,
  apolloCache: ApolloCache<any>,
  clientDefaults: Object,
  clientResolvers: Resolvers,
  clientTypeDefs: DocumentNode,
};

export default function createApolloClient({
  schemaArgs,
  partialCacheDefaults,
  apolloCache,
  clientDefaults,
  clientResolvers,
  clientTypeDefs,
} : ServerApolloClientArgs) {

  apolloCache.writeData({
    data: merge({}, clientDefaults, partialCacheDefaults),
  });

  const link = from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.warn(
            `[GraphQL error]: Message: ${ message }, Location: ${ locations }, Path: ${ path }`,
          ),
        );
      if (networkError) console.warn(`[Network error]: ${ networkError }`);
    }),
    new SchemaLink({ ...schemaArgs }),
  ]);

  return new ApolloClient({
    // @ts-ignore
    link,
    cache: apolloCache,
    typeDefs: clientTypeDefs,
    resolvers: clientResolvers,
    ssrMode: true,
    queryDeduplication: true,
  });
}
