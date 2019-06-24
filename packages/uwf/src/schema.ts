/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { DocumentNode } from 'graphql';
import gql from "graphql-tag";
import merge from 'lodash.merge';

import serverSchemaDeps from './__generated__/serverSchemaDeps';
import serverGraphqlDeps from './__generated__/serverGraphqlDeps';
import clientSchemaDeps from './__generated__/clientSchemaDeps';
import clientGraphqlDeps from './__generated__/clientGraphqlDeps';

const hasObjectTypeExtension = (typeDefs: DocumentNode, type: string) =>
    typeDefs.definitions.some(
      def => Boolean(def.kind === 'ObjectTypeExtension' && def.name.value === type)
    );

const [hasMutation, hasSubscription] = [...serverSchemaDeps, ...clientSchemaDeps]
  .reduce((
    [hasMutation, hasSubscription], [module]
  ) => {
    if (!module.schema) return [hasMutation, hasSubscription];
    return [
      hasMutation || hasObjectTypeExtension(gql(module.schema), 'Mutation'),
      hasSubscription || hasObjectTypeExtension(gql(module.schema), 'Subscription'),
    ];
  }, [false, false]);

const SchemaDefinition = `
  type Query { }
  ${hasMutation ? 'type Mutation { }' : ''}
  ${hasSubscription ? 'type Subscription { }' : ''}
  
  schema {
    query: Query
    ${hasMutation ? 'mutation: Mutation' : ''}
    ${hasSubscription ? 'subscription: Subscription': ''}
  }
`;

// @ts-ignore
const resolvers = merge(
  {},
  ...serverSchemaDeps.map(([module]) => module.resolvers).filter(Boolean),
  ...clientSchemaDeps.map(([module]) => module.resolvers).filter(Boolean),
);

const schema = [
  SchemaDefinition,
  ...serverSchemaDeps.map(([module]) => module.schema).filter(Boolean),
  ...clientSchemaDeps.map(([module]) => module.schema).filter(Boolean),
  ...serverGraphqlDeps.map(([module]) => module.default),
  ...clientGraphqlDeps.map(([module]) => module.default),

];

export default {
  typeDefs: (schema as any) as DocumentNode[],
  resolvers,
  parseOptions: { allowLegacySDLEmptyFields: true },
  // ...(__DEV__ ? { log: e => console.error(e.stack) } : {}),
};
