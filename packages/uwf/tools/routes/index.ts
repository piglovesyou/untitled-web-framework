import path from 'path';
import { promises } from 'fs';
import { genDir } from '../lib/dirs';
import { buildRouteScript } from './buildRouteScript';

const { writeFile } = promises;

export async function outputRoutes() {
  const scriptStr = await buildRouteScript();
  await writeFile(path.resolve(genDir, 'routes.ts'), scriptStr);
}
