#!/usr/bin/env bash

yarn
yarn lerna bootstrap
yarn lerna exec yarn
(cd examples/basic && cd `yarn bin` && ln -s ../../../../packages/uwf/bin/uwf .)
yarn lerna run prepack
(cd examples/basic && yarn codegen)
