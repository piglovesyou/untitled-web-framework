import { promises } from 'fs';
import path from 'path';
import createMD5Hash from "./createMD5Hash";
import { genDir, webDir } from "./dirs";
import getFileNames from "./getFileNames";

const { writeFile } = promises;
const fileDepthDelimiter = '$';

type FileInfo = [string, string, string];

function buildBindSchemaScript(schemaInfoArray: FileInfo[]) {
  return `/* Auto generated file. Don't edit this file. */

${ schemaInfoArray.reduce((acc, [modulePath, displayPath, varName]) => {
    return `${ acc }import * as ${ varName } from '${ modulePath }';
`;
  }, '') }
const importedModules = [
  ${ schemaInfoArray.map(([modulePath, displayPath, varName]) => {
    return `[${ varName }, '${ displayPath }']`;
  }).join(', \n  ') }
];

export default importedModules;
`;
}

function createFileInfo(fileName: string): FileInfo {
  const displayPath = path.relative(webDir, fileName);
  const varName = '$' + createMD5Hash(displayPath);
  let modulePath = path.relative(genDir, fileName);
  const ext = path.extname(modulePath);

  if (ext.startsWith('.ts')) {
    modulePath = path.join(
      path.dirname(modulePath),
      path.basename(modulePath, ext),
    );
  }

  return [modulePath, displayPath, varName];
}


export default async function generateDeps(
  globPattern: string,
  fileBaseNameToGenerate: string,
) {
  const fileNames = await getFileNames(globPattern);

  const scriptContent = buildBindSchemaScript(fileNames.map(createFileInfo));

  const fileName = fileBaseNameToGenerate + '.ts';

  await writeFile(path.resolve(genDir, fileName), scriptContent);
}
