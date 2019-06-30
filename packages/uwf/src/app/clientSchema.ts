import gql from "graphql-tag";
import merge from 'lodash.merge';
import { Resolvers } from "apollo-client";
import schemaDeps from '../../__generated__/clientSchemaDeps';

export const clientTypeDefs = gql(schemaDeps.map(([m]) => m.schema).join('\n'));
export const clientDefaults = merge.apply(null, [{}, ...schemaDeps.map(([m]) => m.defaults).filter(Boolean)]);
export const clientResolvers = merge.apply(null, [{}, ...schemaDeps.map(([m]) => m.resolvers).filter(Boolean)]) as Resolvers;
