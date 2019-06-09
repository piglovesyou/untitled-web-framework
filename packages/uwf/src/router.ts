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
import children from '../__generated__/routesDeps';
import { Route } from 'universal-router';

async function action(context: any) {
  const {next} = context;
  const route = await next();

  if (!route) {
    debugger;
    return;
  }

  // Provide default values for title, description etc.
  route.title = `${route.title || 'Untitled Page'} - www.reactstarterkit.com`;
  route.description = route.description || '';

  return route;
}

const routes: Route = {
  path: '',
  children,
  action,
};

export default new UniversalRouter(routes, {
  resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return context.route
        .load()
        .then(({module, chunkName}: any) => {
          const component = React.createElement(module.default);
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
