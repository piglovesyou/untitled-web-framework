import { generate } from '@graphql-codegen/cli';
import { ApolloServer } from 'apollo-server';
import getPort from 'get-port';
import path from 'path';
import { buildDir, genDir, srcDir, userDir } from './lib/dirs';
import prepareDeps from './lib/prepareDeps';
import runWebpack from './lib/runWebpack';
import webpackConfig from './webpack.config';

const [, serverConfig] = webpackConfig;

/**
 * Generate Flow declarations from GraphQL. Since it requires
 * a running GraphQL server, it launches a server for the use.
 */
export default async function codegen() {
  // const promiseRemoveOldTypes = new Promise(resolve =>
  //   rimraf(path.resolve(userDir, '{./,src/**/}__generated__'), resolve),
  // );

  await prepareDeps();

  const promiseCompileSchemaJs = await runWebpack(
    {
      ...serverConfig,
      entry: path.join(srcDir, 'app/schema'),
      output: {
        path: serverConfig!.output!.path,
        filename: 'schema.js',
        libraryTarget: 'commonjs2',
      },
    },
    // @ts-ignore
    serverConfig.stats,
  );

  const promisePort = getPort();

  const [port] = await Promise.all([
    promisePort,
    // promiseRemoveOldTypes,
    promiseCompileSchemaJs,
  ]);

  // eslint-disable-next-line global-require, import/no-dynamic-require, import/no-unresolved
  const builtSchema = require(path.join(buildDir, 'schema')).default;
  const server = new ApolloServer(builtSchema);
  const { server: httpServer } = await server.listen({ port });

  await generate(
    {
      schema: `http://localhost:${port}/graphql`,
      documents: path.join(userDir, '**/*.graphql'),
      generates: {
        [path.join(genDir, 'dataBinders.tsx')]: {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-react-apollo',
          ],
          config: {
            // withHOC: false,
            withHooks: true,
          },
        },
      },
    },
    true,
  );

  await new Promise(resolve => httpServer.close(resolve));
}
