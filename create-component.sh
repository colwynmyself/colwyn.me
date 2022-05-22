#!/usr/bin/env bash

COMPONENT_PATH="src/${1}"

mkdir -p "${COMPONENT_PATH}"
touch "${COMPONENT_PATH}/index.handlebars"
touch "${COMPONENT_PATH}/index.scss"
