/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { DocumentNode } from 'graphql';
import merge from 'lodash.merge';

import serverSchemaDeps from '../../__generated__/serverSchemaDeps';
// import serverGraphqlDeps from '../../__generated__/';
import clientSchemaDeps from '../../__generated__/clientSchemaDeps';
// import clientGraphqlDeps from '../../__generated__/clientGraphqlDeps';

const SchemaDefinition = `
  type Query { _: Boolean }
  type Mutation { _: Boolean }
  type Subscription { _: Boolean }
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

// @ts-ignore
const resolvers = merge.apply(null, [
  {},
  ...serverSchemaDeps.map(([module]) => module.resolvers).filter(Boolean),
  ...clientSchemaDeps.map(([module]) => module.resolvers).filter(Boolean),
]);

const schema = [
  SchemaDefinition,
  ...serverSchemaDeps.map(([module]) => module.schema).filter(Boolean),
  ...clientSchemaDeps.map(([module]) => module.schema).filter(Boolean),
];

export default {
  typeDefs: (schema as any) as DocumentNode[],
  resolvers,
  // ...(__DEV__ ? { log: e => console.error(e.stack) } : {}),
};
