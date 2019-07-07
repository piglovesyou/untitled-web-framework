/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import cp from 'child_process';
import * as path from 'path';
import pkg from '../../package.json';
import bundle from './bundle';
import clean from './clean';
import copy from './copy';
import { libDir, userDir } from './lib/dirs';
import { moveDir } from './lib/fs';
import render from './render';
import run from './run';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
  await run(clean);
  await run(copy);
  await run(bundle);

  if (process.argv.includes('--static')) {
    await run(render);
  }

  await moveDir(path.join(libDir, 'build'), path.join(userDir, 'build'));

  if (process.argv.includes('--docker')) {
    cp.spawnSync('docker', ['build', '-t', pkg.name, '.'], {
      stdio: 'inherit',
    });
  }
}

export default build;
