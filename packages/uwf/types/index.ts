import {ComponentType} from "react";

export type SchemaDepsBase = {
  schema?: string,
  resolvers?: Object,
};

export type ClientSchemaDeps = SchemaDepsBase & {
  defaults?: Object,
};

export type ModuleInfo<T> = [T, string];

export type SchemaInfo = ModuleInfo<SchemaDepsBase>;

export type ClientSchemaInfo = ModuleInfo<ClientSchemaDeps>;

export type GraphqlDeps = ModuleInfo<{default: string}>;

export type RouteInfo = {
  module: {
    title: string,
    default: ComponentType,
  },
  chunkName: string,
  ext: string,
};
