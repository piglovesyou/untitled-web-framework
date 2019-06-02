import glob from 'glob';
import path from 'path';
import { genDir, webDir } from '../lib/dirs';

type RoutePath = string;
type ModulePath = string;
type ChunkName = string;
type ExtType = string;
type PathInfo = [RoutePath, ModulePath, ChunkName, ExtType];

function buildRouteChildScript([
  routePath,
  modulePath,
  chunkName,
  extType,
]: PathInfo): string {
  return `
  {
    path: '${routePath}',
    load: async () => ([
      '${chunkName}',
      '${extType}',
      await import(/* webpackChunkName: '${chunkName}' */ '${modulePath}'),
    ]),
  },
`;
}

function buildRoutesScript(pathInfoArray: PathInfo[]): string {
  return `
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
import { Route } from 'universal-router';

import defaultRouteAction from '../tools/routes/defaultRouteAction';

const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
  
  ${pathInfoArray.map(buildRouteChildScript).join('')}
  
  ],

  action: defaultRouteAction,
};
  
export default routes;
`;
}

function getFileNames(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const globPath = path.resolve(webDir, 'routes/**/{*.ts,*.tsx,*.md}');
    glob(globPath, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
}

async function createPathInfoArray(): Promise<PathInfo[]> {
  const files = await getFileNames();
  return files.map(f => {
    // TODO refactor
    const dir = path.dirname(f);
    const ext = path.extname(f);
    const file = path.basename(f);
    let base = path.basename(f, ext);
    if (base === 'index') base = '';

    let relDir = path.relative(path.resolve(webDir, 'routes'), dir);
    if (relDir === 'index') relDir = '';
    const chunkName = relDir ? relDir.split('/')[0] : base || 'index';
    const routePath = path.join('/', relDir, base);
    const modulePath = path.join(
      path.relative(genDir, dir),
      ext.startsWith('.ts') ? base : file,
    );
    return [routePath, modulePath, chunkName, ext];
  });
}

export async function buildRouteScript() {
  const pathInfoArray = await createPathInfoArray();
  return buildRoutesScript(pathInfoArray);
}
