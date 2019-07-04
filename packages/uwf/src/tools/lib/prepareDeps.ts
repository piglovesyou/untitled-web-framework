import { genDir } from './dirs';
import { makeDir } from './fs';
import generateRoutesDeps from './generateRoutesDeps';
import generateDeps from './generateDeps';

export default async function prepareDeps() {
  await makeDir(genDir);
  await generateDeps('data/**/*.ts', 'serverSchemaDeps', 'SchemaInfo');
  await generateDeps('data/**/*.graphql', 'serverGraphqlDeps', 'GraphqlDeps');
  await generateDeps('state/**/*.ts', 'clientSchemaDeps', 'ClientSchemaInfo');
  await generateDeps('state/**/*.graphql', 'clientGraphqlDeps', 'GraphqlDeps');
  await generateRoutesDeps();
}
