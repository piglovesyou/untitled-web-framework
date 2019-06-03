import createMD5Hash from "../lib/createMD5Hash";
import { webDir } from "../lib/dirs";
import getFileNames from "../lib/getFileNames";
// import * as x from '../../src/DOMUtils';

const fileDepthDelimiter = '$';


// import * as a from '../../src/DOMUtils';
//
// export const schemaModules = [a];
// export const graphqlModules = [a];
import path from 'path';
import {genDir} from "../lib/dirs";
import toBase64 from "../lib/toBase64";

type SchemaInfo = [string, string, string];

function buildBindSchemaScript(schemaInfoArray: SchemaInfo[]) {
  return `
${schemaInfoArray.reduce((acc, [modulePath, displayPath, varName]) => {
    return `
${acc}import * as ${varName} from '${modulePath}'; 
`;
  }, '')}
export const schemaInfoArray = [
  ${schemaInfoArray.map(([modulePath, displayPath, varName]) => {
    return `[${varName}, '${displayPath}']`;
  }).join(', \n  ') }
];
`;
}

async function main() {
  const [schemaFiles, graphqlFiles] = await Promise.all([
    getFileNames('graphql/**/*.ts'),
    getFileNames('graphql/**/*.graphql'),
  ]);

  const schemaInfoArray = schemaFiles.map(f => {
    const displayPath = path.relative(webDir, f);
    const varName = '$' + createMD5Hash(displayPath);
    const modulePath = path.relative(genDir, f);

    return [modulePath, displayPath, varName];
  });

  console.log(buildBindSchemaScript(schemaInfoArray));


}

main();

