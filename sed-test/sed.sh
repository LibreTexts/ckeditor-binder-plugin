#!/bin/bash

VERSION=$(ls release/ | sort | tail -n1 | sed 's/\.md$//')
DATE=$(TZ='America/Los_Angeles' date -I)
VERSION_STR="Release: $VERSION - Date: $DATE"
sed -i "s/Development Version/$VERSION_STR/" string.txt
sed -i "s/0\.0\.0/$VERSION/" package.txt
