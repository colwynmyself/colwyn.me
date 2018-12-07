#!/bin/sh

yarn
PUBLIC_URL=/ yarn build
rm -rf build_final
mv build build_final
