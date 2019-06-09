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
    load: async (): Promise<RouteInfo> => ({
      module: await import(/* webpackChunkName: '${ chunkName }' */ '${ modulePath }'),
      chunkName: '${ chunkName }',
      ext: '${ ext }',
    }),
  },
`;
}

function buildRoutesScript(pathInfoArray: PathInfo[]): string {
  return `/* Auto-generated. Do not edit. */

import { RouteInfo } from '../types';

const routes = [
${ pathInfoArray.map(buildRouteChildScript).join('') }
];
  
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
