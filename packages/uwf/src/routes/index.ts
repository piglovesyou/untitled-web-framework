/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// The top-level (parent) route
import { Route } from 'universal-router';

import defaultRouteAction from '../../tools/routes/defaultRouteAction';

import routesDeps from '../../__generated__/routesDeps'
import routesMdDeps from '../../__generated__/routesMdDeps'

const children = routesDeps.map(route => {
  return {
    path: '',
    load: () => import(/* webpackChunkName: 'home' */ './home'),
  };
});

const routes: Route = {
  path: '',

  // // Keep in mind, routes are evaluated in order
  // children: [
  //   {
  //     path: '',
  //     load: () => import(/* webpackChunkName: 'home' */ './home'),
  //   },
  //   {
  //     path: '/contact',
  //     load: () => import(/* webpackChunkName: 'contact' */ './contact'),
  //   },
  //   {
  //     path: '/login',
  //     load: () => import(/* webpackChunkName: 'login' */ './login'),
  //   },
  //   {
  //     path: '/register',
  //     load: () => import(/* webpackChunkName: 'register' */ './register'),
  //   },
  //   {
  //     path: '/about',
  //     load: () => import(/* webpackChunkName: 'about' */ './about'),
  //   },
  //   {
  //     path: '/privacy',
  //     load: () => import(/* webpackChunkName: 'privacy' */ './privacy'),
  //   },
  //   {
  //     path: '/admin',
  //     load: () => import(/* webpackChunkName: 'admin' */ './admin'),
  //   },
  //
  //   // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
  //   {
  //     path: '(.*)',
  //     load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
  //   },
  // ],

  action: defaultRouteAction,
};

export default routes;
