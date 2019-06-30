/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { ComponentType } from "react";
import Link from "uwf/Link";
import withStyles from "uwf/withStyles";
import s from "./Navigation.css";

const Navigation: ComponentType<{}> = () => (
  <div className={s.root} role="navigation">
    <Link className={s.link} to="/about">
      About
    </Link>
    <Link className={s.link} to="/posts">
      Posts
    </Link>
  </div>
);

export default withStyles(s)(Navigation);
