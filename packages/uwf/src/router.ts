/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import UniversalRouter from 'universal-router';
import routes from '../__generated__/routesDeps';
import Page from "./components/Page/Page";

export default new UniversalRouter(routes, {
  resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return context.route
        .load()
        // .then((action: any) => action.default(context, params));
        .then(({module, chunkName, ext}: any) => {
          const component = ext === '.md'
              ? React.createElement(Page, module.default)
              : React.createElement(module.default)
          ;
          return {
            chunks: [chunkName],
            title: module.title,
            component,
          };
        });
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return undefined;
  },
});
