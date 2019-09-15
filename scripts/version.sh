#bin/bash

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

FILE=.env
if test -f "$FILE"; then
    echo "$FILE already exist"
else
  echo "REACT_APP_VERSION=\"$PACKAGE_VERSION\"" > $FILE
  echo "REACT_APP_VERSION correctly stored to $FILE file"
fi
