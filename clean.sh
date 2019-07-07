#!/usr/bin/env bash

git clean -df

find . -type dir -maxdepth 3 \( \
        -name node_modules \
    -o  -name __generated__ \
    -o  -name build \
    -o  -name dist \
\) | xargs rm -rf
