import path from 'path';
import { promises } from 'fs';
import { genDir } from '../lib/dirs';
import { generateRoutesDeps } from './generateRoutesDeps';

const { writeFile } = promises;

export async function generateRoutes() {
  const scriptStr = await generateRoutesDeps();
  await writeFile(path.resolve(genDir, 'routes.ts'), scriptStr);
}

if (require.main) generateRoutes();
