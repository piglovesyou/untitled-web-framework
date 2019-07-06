#!/usr/bin/env bash

find . -type dir \( \
        -name node_modules \
    -o  -name __generated__ \
    -o  -name build \
    -o  -name dist \
\) | xargs rm -rf
