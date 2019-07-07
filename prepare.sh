#!/usr/bin/env bash

set -e

USER_DIR=`pwd`/examples/basic
LIB_DIR=`pwd`/packages/uwf

yarn
yarn lerna bootstrap

# Codegen to generate TS files for examples/basic
(cd $LIB_DIR && yarn && NODE_ENV=develop INIT_CWD=$USER_DIR ./bin/uwf codegen && yarn run prepack)

# Copy $LIB_DIR as deps of examples/basic by installing all deps
(cd $USER_DIR && yarn)

