#! /bin/sh

node_modules/.bin/browserify --transform=./node_modules/babelify test.js \
  | node_modules/.bin/testron \
  | node_modules/.bin/tap-spec
