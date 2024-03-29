/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
/* eslint-disable global-require */

import path from 'path';
import chokidar from 'chokidar';
import { buildDir, libDir, userDir } from './lib/dirs';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import { format } from './run';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build');
  const libPkg = require(path.join(libDir, 'package.json'));
  const userPkg = require(path.join(userDir, 'package.json'));
  delete userPkg.dependencies.uwf;
  await Promise.all([
    writeFile(
      path.join(buildDir, 'package.json'),
      JSON.stringify(
        {
          private: true,
          engines: userPkg.engines || libPkg.engines,
          dependencies: {
            ...libPkg.dependencies,
            ...userPkg.dependencies,
          },
          scripts: {
            start: 'node server.js',
          },
        },
        null,
        2,
      ),
    ),
    // copyFile('LICENSE.txt', 'build/LICENSE.txt'),
    // copyFile('yarn.lock', 'build/yarn.lock'),
    copyDir(path.join(userDir, 'public'), path.join(buildDir, 'public')),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch(['public/**/*'], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const start = new Date();
      const src = path.relative('./', filePath);
      const dist = path.join(
        'build/',
        src.startsWith('src') ? path.relative('src', src) : src,
      );
      switch (event) {
        case 'add':
        case 'change':
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      const end = new Date();
      const time = end.getTime() - start.getTime();
      console.info(`[${format(end)}] ${event} '${dist}' after ${time} ms`);
    });
  }
}

export default copy;
