import { ApolloClient, Resolvers } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import apolloLogger from 'apollo-link-logger';
import { DocumentNode } from 'graphql';
import { ApolloCache } from 'apollo-cache';

type CliantApolloClientArgs = {
  clientTypeDefs: DocumentNode,
  clientResolvers: Resolvers,
  apolloCache: ApolloCache<any>,
};

export default function createApolloClient({
  clientTypeDefs,
  clientResolvers,
  apolloCache,
}: CliantApolloClientArgs) {
  // Restore cache defaults to make the same one in server.js
  const cache = apolloCache.restore(window.App.cache);

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
    ...(__DEV__ ? [apolloLogger] : []),
    new HttpLink({
      uri: '/graphql',
      credentials: 'include',
    }),
  ]);

  return new ApolloClient({
    // @ts-ignore
    link,
    cache,
    typeDefs: clientTypeDefs,
    resolvers: clientResolvers,
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
