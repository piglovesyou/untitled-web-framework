import path from 'path';
import createMD5Hash from './createMD5Hash';
import { genDir, userDir } from './dirs';
import getFileNames from './getFileNames';
import { writeFile } from './fs';

type ModuleInfo = {
  modulePath: string;
  displayPath: string;
  varName: string;
};

function buildBindSchemaScript(
  moduleInfoArray: ModuleInfo[],
  moduleType: string,
) {
  return `/* Auto-generated. Do not edit. */

${moduleInfoArray.reduce((acc, { modulePath, varName }) => {
  return `${acc}import * as ${varName} from '${modulePath}';
`;
}, '')}
import { ${moduleType} } from 'uwf/types';

const importedModules: ${moduleType}[] = [
  ${moduleInfoArray
    .map(({ displayPath, varName }) => {
      return `[${varName}, '${displayPath}']`;
    })
    .join(', \n  ')}
];

export default importedModules;
`;
}

function createFileInfo(fileName: string): ModuleInfo {
  const displayPath = path.relative(userDir, fileName);
  const varName = `$${createMD5Hash(displayPath)}`;
  let modulePath = path.relative(genDir, fileName);
  const ext = path.extname(modulePath);

  if (ext.startsWith('.ts')) {
    modulePath = path.join(
      path.dirname(modulePath),
      path.basename(modulePath, ext),
    );
  }

  return { modulePath, displayPath, varName };
}

export default async function generateDeps(
  globPattern: string,
  fileBaseNameToGenerate: string,
  moduleType: string,
) {
  const fileNames = await getFileNames(globPattern);

  const scriptContent = buildBindSchemaScript(
    fileNames.map(createFileInfo),
    moduleType,
  );

  const fileName = `${fileBaseNameToGenerate}.ts`;

  await writeFile(path.resolve(genDir, fileName), scriptContent);
}
