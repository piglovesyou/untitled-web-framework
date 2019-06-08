import { ApolloServer } from 'apollo-server';
import getPort from 'get-port';
import rimraf from 'rimraf';
import { spawn } from './lib/cp';
import { libDir, webDir } from "./lib/dirs";
import runWebpack from './lib/runWebpack';
import webpackConfig from './webpack.config';
import path from 'path';

const [, serverConfig] = webpackConfig;

/**
 * Generate Flow declarations from GraphQL. Since it requires
 * a running GraphQL server, it launches a server for the use.
 */
export default async function codegen() {
  const promiseRemoveOldTypes = new Promise(resolve =>
    rimraf(path.resolve(webDir, '{./,src/**/}__generated__'), resolve),
  );

  // TODO: Generate schema dependency information

  const promiseCompileSchemaJs = await runWebpack(
    {
      ...serverConfig,
      entry: path.join(libDir, 'src/data/schema'),
      output: {
        path: serverConfig.output.path,
        filename: 'schema.js',
        libraryTarget: 'commonjs2',
      },
    },
    serverConfig.stats,
  );

  const promisePort = getPort();

  const [port] = await Promise.all([
    promisePort,
    promiseRemoveOldTypes,
    promiseCompileSchemaJs,
  ]);

  // eslint-disable-next-line global-require, import/no-dynamic-require, import/no-unresolved
  const builtSchema = require('../build/schema').default;
  const server = new ApolloServer(builtSchema);
  const { server: httpServer } = await server.listen({ port });

  // TODO: It doesn't work
  // console.log(`http://localhost:${port}/graphql`);
  // await new Promise(resolve => setTimeout(resolve, 100 *1000));

  await spawn(
    'yarn',
    [
      'apollo',
      'client:codegen',
      '--includes', path.join(webDir, '**/*.graphql'),
      // '--includes', path.join(webDir, '**/*.ts'),
      // '--includes', path.join(webDir, '**/*.ts'),
      // '--includes', path.join(webDir, '**/*.tsx'),
      '--target',
      'typescript',
      '--endpoint',
      `http://localhost:${port}/graphql`,
    ],
    {
      stdio: 'inherit',
    },
  );

  await new Promise(resolve => httpServer.close(resolve));
}
