#!/bin/bash
set -x
set -e


archive_path=$1

# Archive
# The same as Xcode -> Product -> Archive



# Since RN-0.60，Pods is required and we can only use workspace to archive app
# Rememver: .xcodeproj dirtory is useless once .xcworkspace dirtory exists
# cd $PROJECT_PATH
workspace=$(ls ios | grep '.xcworkspace')

if [ -n "$workspace" ]
then
  project_name=$(echo $workspace | cut -d. -f1)

  xcodebuild clean \
    -workspace "./ios/$workspace" \
    -scheme "$project_name"

  xcodebuild archive \
    -workspace "./ios/$workspace" \
    -scheme "$project_name" \
    -configuration "Release" \
    -archivePath "$archive_path" \
    -allowProvisioningUpdates \
    -showBuildTimingSummary
else
  project=$(ls ios | grep '.xcodeproj')
  project_name=$(echo $project | cut -d. -f1)

  xcodebuild clean \
    -project "./ios/$project" \
    -scheme ${project_name}

  xcodebuild archive \
    -project "./ios/$project" \
    -scheme "$project_name" \
    -configuration "Release" \
    -archivePath "$archive_path" \
    -allowProvisioningUpdates \
    -showBuildTimingSummary
fi
