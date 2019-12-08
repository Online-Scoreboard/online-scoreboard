#!/bin/bash
FILE=.env

if test -f "$FILE"; then
    echo "$FILE already exist"
else
  echo "REACT_APP_VERSION=\"$TARGET_ENV\"" > $FILE
  echo "REACT_APP_API_URL=\"$REACT_APP_API_URL\"" >> $FILE
  echo "REACT_APP_APP_NAME=\"$REACT_APP_APP_NAME\"" >> $FILE
  echo "REACT_APP_REGION=\"$REACT_APP_REGION_$TARGET_ENV\"" >> $FILE
  echo "REACT_APP_USER_POOL_ID=\"$REACT_APP_USER_POOL_ID_$TARGET_ENV\"" >> $FILE
  echo "REACT_APP_APP_CLIENT_ID=\"$REACT_APP_APP_CLIENT_ID_$TARGET_ENV\"" >> $FILE
  echo "Environment variables correctly stored"
fi
