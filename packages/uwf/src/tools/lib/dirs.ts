import path from 'path';

export const libDir = path.resolve(__dirname, '../../../');
export const userDir = process.env.INIT_CWD as string;
export const genDir = path.resolve(libDir, '__generated__');
export const srcDir = path.resolve(__dirname, '../../');
export const buildDir = path.resolve(libDir, 'build');
