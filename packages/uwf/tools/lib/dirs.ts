import path from 'path';
import mkdirp from 'mkdirp';

export const libDir = path.resolve(__dirname, '../../');
export const userDir = process.env.INIT_CWD as string;
export const genDir = path.resolve(userDir, '__generated__');
mkdirp.sync(genDir);
