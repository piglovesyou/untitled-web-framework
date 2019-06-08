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

import schemaDeps from '../../__generated__/schemaDeps';
import graphqlDeps from '../../__generated__/graphqlDeps';

const Query = [
  `
  type Query {
    ${schemaDeps.map(([module, relPath]) => {
      return module.queries && module.queries.join('\n');
    }).filter(s => Boolean(s)).join('\n')}
  }
`,
];

const Mutation =
  schemaDeps.some(([module]) => module.mutations) ? [ `
  type Mutation {
    
    ${schemaDeps.map(([module, relPath]) => {
      return module.mutations && module.mutations.join('\n');
    }).filter(s => Boolean(s)).join('\n')}
  }
`,
] : [];

const SchemaDefinition = [
  `
  schema {
    query: Query
    mutation: Mutation
  }
`,
];

const resolvers = merge.apply(null,
  schemaDeps.map(([module, relPath]) => {
    return module.resolvers && module.resolvers;
  }).filter(e => Boolean(e))
);

const schema = [
  ...SchemaDefinition,
  ...Query,
  ...Mutation,
  ...schemaDeps.map(([module, relPath]) => {
    return module.schema && module.schema;
  }).filter(s => Boolean(s)),
];

export default {
  typeDefs: (schema as any) as DocumentNode[],
  resolvers,
  // ...(__DEV__ ? { log: e => console.error(e.stack) } : {}),
};
