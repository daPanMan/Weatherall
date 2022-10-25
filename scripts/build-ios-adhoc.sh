#!/bin/bash

# env=$1
# echo $env

# cp ./scripts/config/$env/config.js ./src/utils/config.js

./scripts/libs/build-ios.sh

dirname=./ios-export/build/app-ios-$(date +%Y-%m-%d-%H-%M-%S)

mv ./ios-export/build/app-ios $dirname