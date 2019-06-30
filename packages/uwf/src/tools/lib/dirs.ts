import path from 'path';
import mkdirp from 'mkdirp';

export const libDir = path.resolve(__dirname, '../../../');
export const userDir = process.env.INIT_CWD as string;
export const genDir = path.resolve(libDir, '__generated__');
export const srcDir = path.join(libDir, 'src');
export const buildDir = path.join(userDir, 'build');
mkdirp.sync(genDir);
