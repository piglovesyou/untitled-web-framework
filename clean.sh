#!/usr/bin/env bash

find . -type dir \( \
    -name node_modules -o \
    -name __generated__ -o \
    -name __generated__ -o \
    -name dist -o \
    -name build \
\) | xargs rm -rf
