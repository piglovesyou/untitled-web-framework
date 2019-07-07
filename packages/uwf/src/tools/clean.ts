/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import { libDir, userDir } from 'uwf/src/tools/lib/dirs';
import { cleanDir } from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
function clean() {
  const buildDirs = [
    path.join(libDir, 'build/*'),
    path.join(userDir, 'build/*'),
  ];
  return Promise.all(
    buildDirs.map(dir =>
      cleanDir(dir, {
        nosort: true,
        dot: true,
        ignore: ['build/.git'],
      }),
    ),
  );
}

export default clean;
