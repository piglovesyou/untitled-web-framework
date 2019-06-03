import glob from 'glob';
import path from 'path';
import { genDir, webDir } from './dirs';

export default function getFileNames(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const globPath = path.resolve(webDir, pattern);
    glob(globPath, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
}

