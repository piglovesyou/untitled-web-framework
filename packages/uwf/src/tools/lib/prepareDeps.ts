import { genDir } from './dirs';
import { makeDir } from './fs';
import generateRoutesDeps from './generateRoutesDeps';
import generateDeps from './generateDeps';

export default async function prepareDeps() {
  await makeDir(genDir);
  await generateDeps('data/**/*.ts', 'serverSchemaDeps', 'uwf.SchemaInfo');
  await generateDeps(
    'data/**/*.graphql',
    'serverGraphqlDeps',
    'uwf.GraphqlDeps',
  );
  await generateDeps(
    'state/**/*.ts',
    'clientSchemaDeps',
    'uwf.ClientSchemaInfo',
  );
  await generateDeps(
    'state/**/*.graphql',
    'clientGraphqlDeps',
    'uwf.GraphqlDeps',
  );
  await generateRoutesDeps();
}
