
export type SchemaDepsBase = {
  schema: string,
  resolvers?: Object,
};

export type ClientSchemaDeps = SchemaDepsBase & {
  defaults?: Object,
};

export type ModuleInfo<T> = [T, string];

export type SchemaInfo = ModuleInfo<SchemaDepsBase>;

export type ClientSchemaInfo = ModuleInfo<ClientSchemaDeps>;

export type GraphqlInfo = ModuleInfo<string>;
