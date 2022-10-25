#!/bin/bash

set -x
set -e

ios_export_plist="./ios-export/ad-hoc.plist"
ios_app_save_dir=./ios-export/build/app-ios
# ios_app_save_dir=./ios-export/build/app-$(date +%Y-%m-%d-%H-%M-%S)
archive_path=./ios-export/build/archive.xcarchive

mkdir -p ios-export/build
rm -rf ios-export/build/archive.xcarchive

if [ -z "$(readlink $0)" ]
then
  dir=$(dirname $0)
else
  dir=$(dirname $0)/$(dirname $(readlink $0))
fi
libs=$dir/libs

if [ -z "$ios_export_plist" ]
then
  echo -e "\n\033[31mError: The parameter \"ios-export-plist\" is required.\033[0m\n" 1>&2
  echo -e "\033[33mnpx upload-build-ios --ios-export-plist=path/to/xxx.plist\033[0m\n" 1>&2
  exit 1
fi



echo -e "\n\033[32mBuilding ios app...\033[0m\n"

bash $libs/archive.sh $archive_path
bash $libs/export-ipa.sh $ios_export_plist $ios_app_save_dir $archive_path

echo -e "\nView ipa file at: \033[32m$ios_app_save_dir\033[0m\n"