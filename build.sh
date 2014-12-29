#!/bin/bash

# Indigo Design Github Pages build script

git checkout gh-pages
cp -R dist/* .
git add *.html assets/ admin/
git commit -m 'Updates preview'
git push origin gh-pages
git checkout develop
