import { promises } from 'fs';
const { writeFile } = promises;
import path from 'path';
import { genDir, webDir } from '../lib/dirs';
import getFileNames from "../lib/getFileNames";

type PathInfo = {
  routePath: string,
  modulePath: string,
  chunkName: string,
  ext: string,
};

function buildRouteChildScript(
  {
    routePath,
    modulePath,
    chunkName,
    ext,
  }: PathInfo
): string {
  return `
  {
    path: '${ routePath }',
    load: async () => ({
      module: await import(/* webpackChunkName: '${ chunkName }' */ '${ modulePath }'),
      chunkName: '${ chunkName }',
      ext: '${ ext }',
    }),
  },
`;
}

function buildRoutesScript(pathInfoArray: PathInfo[]): string {
  return `/* Auto generated file. Don't edit this file. */

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
  
  ${ pathInfoArray.map(buildRouteChildScript).join('') }
  
  ],

  action: defaultRouteAction,
};
  
export default routes;
`;
}

function createpathInfo(f: string): PathInfo {
  // TODO refactor
  const dir = path.dirname(f);
  const ext = path.extname(f);
  const file = path.basename(f);
  let base = path.basename(f, ext);

  let routePath = path.relative(webDir, path.join(dir, base)).slice('routes'.length);
  routePath = omitIndex(routePath) || '/';

  const chunkName = routePath.split('/')[0] || 'home';
  // const routePath = path.join('/', relDir, base);
  const modulePath = path.join(
    path.relative(genDir, dir),
    ext.startsWith('.ts') ? base : file,
  );
  return { routePath, modulePath, chunkName, ext };
};

function omitIndex(p: string): string {
  if (p.endsWith('/index')) {
    const shortened = p.slice(0, p.length - '/index'.length);
    return omitIndex(shortened);
  }
  return p;
}

export default async function generateRoutesDeps() {
  const files = await getFileNames('routes/**/{*.ts,*.tsx,*.md}');
  // const files = await getFileNames('routes/**/{*.ts,*.tsx}');
  const pathInfoArray = files.map(createpathInfo);
  const scriptContent = buildRoutesScript(pathInfoArray);
  await writeFile(path.resolve(genDir, 'routesDeps.ts'), scriptContent);
}

if (require.main === module) {
  generateRoutesDeps();
}
