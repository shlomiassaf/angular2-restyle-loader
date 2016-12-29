#!/bin/bash

rm -rf loader/angular2-restyle-loader/lib

node_modules/.bin/tsc --project tsconfig.lib.json 2> /dev/null

if [ $? -eq 0 ]
then
  echo "Compilation OK, publishing"
  cp README.md loader/angular2-restyle-loader/README.md
  NPM_USER=$(npm whoami 2> /dev/null)
  if [ "${NPM_USER}" != "shlomiassaf" ]; then
    echo "You must be logged in as 'shlomiassaf' to publish. Use 'npm login'."
    exit
  fi

  set -ex

  npm publish --access public loader/angular2-restyle-loader

else
  echo "Compilation failed" >&2
fi
