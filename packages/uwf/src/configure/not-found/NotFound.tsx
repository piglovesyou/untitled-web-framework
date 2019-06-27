/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { FunctionComponent } from 'react';
import Link from '@configure@/Link';

type PropTypes = {
  title: string;
};

const NotFound: FunctionComponent<PropTypes> = props => (
  <div>
    <h1>404 Page Not Found</h1>
    <p>Sorry, the page you were trying to view does not exist.</p>
    <p><Link to={'/'}>Go to Top</Link></p>
  </div>
);

export default NotFound;
