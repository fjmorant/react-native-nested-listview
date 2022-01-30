#!/bin/bash

kill -9 $(ps -A | grep '[r]eact-native/scripts/../cli.js' | awk '{print $1}')
kill -9 $(ps -A | grep '[w]ml' | awk '{print $1}')

mv .watchmanconfig .template.watchmanconfig

wml rm all

watchman watch-del-all

git checkout -- package.json

rm -rf ../react-native-nested-listview-examples/node_modules

cd .. && cd react-native-nested-listview-examples && yarn install