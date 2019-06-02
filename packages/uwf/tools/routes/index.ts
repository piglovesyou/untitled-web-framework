import path from 'path';
import { promises } from 'fs';
import { genDir } from '../lib/dirs';
import { buildRouteScript } from './buildRouteScript';

const { writeFile } = promises;

export async function generateRoutes() {
  const scriptStr = await buildRouteScript();
  await writeFile(path.resolve(genDir, 'routes.ts'), scriptStr);
}

if (require.main) generateRoutes();
