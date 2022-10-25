#!/bin/bash

# env=$1
# echo $env

# cp ./scripts/config/$env/config.js ./src/utils/config.js


mkdir -p android-export/build


npx build-android
# cd android
# rm -rf build/ app/build/
# ./gradlew assembleRelease
# cd -

apkname=./android-export/build/app-android-$(date +%Y-%m-%d-%H-%M-%S).apk

mv ./android/app/build/outputs/apk/release/app-release.apk $apkname