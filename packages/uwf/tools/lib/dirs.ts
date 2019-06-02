import path from 'path';
import mkdirp from 'mkdirp';

// export const webDir = process.env.INIT_CWD as string;
export const webDir = '/Users/soichi/IdeaProjects/uwf/examples/basic';
export const libDir = path.resolve(__dirname, '../../');
export const genDir = path.resolve(libDir, '__generated__');
mkdirp.sync(genDir);
