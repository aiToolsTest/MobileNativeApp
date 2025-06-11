#!/bin/sh
set -e
FONT_DIR="${SRCROOT}/MobileAppAndroid/Resources/Fonts"
TARGET_DIR="${TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}"
echo "Copying fonts from $FONT_DIR to $TARGET_DIR"
cp "$FONT_DIR"/*.ttf "$TARGET_DIR/"
