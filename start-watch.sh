kill -9 $(ps -A | grep '[r]eact-native/scripts/../cli.js' | awk '{print $1}')

mv .template.watchmanconfig .watchmanconfig

watchman watch "$(npm root -g)/wml/src"

wml add ./ ../react-native-nested-listview-examples/node_modules/react-native-nested-listview

json -I -f package.json -e "this.main=\"src/index.ts\""
json -I -f package.json -e "this.types=\"src/index.ts\""

wml start