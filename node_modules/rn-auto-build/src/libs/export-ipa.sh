#!/bin/bash
set -x
set -e

# Variable export_method can be one of [app-store, ad-hoc]
plist_file=$1
export_dir=$2
archive_path=$3

rm -rf $export_dir

# Export
# The same as Xcode -> Window -> Organizer -> Export
xcodebuild -exportArchive \
  -archivePath $archive_path \
  -exportPath $export_dir \
  -exportOptionsPlist $plist_file \
  -allowProvisioningUpdates
