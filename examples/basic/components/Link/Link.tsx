/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { ReactNode } from 'react';
import { history } from 'uwf';

function isLeftClickEvent(event: MouseEvent) {
  return event.button === 0;
}

function isModifiedEvent(event: MouseEvent) {
  return Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

type PropTypes = {
  tagName: string;
  to: string;
  onClick?: Function;
  children?: ReactNode;
  className?: string;
};

const Link = ({
                tagName = 'a',
                to,
                children,
                onClick = (event: any) => {

                  if (isModifiedEvent(event)) return;
                  if (!isLeftClickEvent(event)) return;
                  if (event.defaultPrevented === true) return;

                  event.preventDefault();
                  history.push(to);
                },
                ...restProps,
              }: PropTypes) => {

  const props = {
    ...(tagName === 'a' ? {href: to} : null),
    ...restProps,
  };

  return React.createElement(tagName, props, children);
};

export default Link;
