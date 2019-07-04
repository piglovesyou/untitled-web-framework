#!/usr/bin/env bash

yarn
yarn lerna bootstrap
yarn lerna exec yarn
(cd examples/basic && cd `yarn bin` && ln -s ../../../../packages/uwf/bin/uwf .)
(cd examples/basic && yarn codegen)
