#!/usr/bin/env bash

git clean -df

find . -type dir -depth 2 \( \
        -name node_modules \
    -o  -name __generated__ \
    -o  -name build \
    -o  -name dist \
\) | xargs rm -rf
