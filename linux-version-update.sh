#!/bin/bash

# Variables for paths and settings
directoryx=="$(dirname -- $(readlink -fn -- "$0"; echo x))"
PROJECT_ROOT="${directoryx=%x}"
START_DIR=$PWD
VERSION_NUMBER=""
BUILD_DIR_SRC="/home/user/Sound-Smarter/Client-Details"
BUILD_DIR_DEST="/srv/www-data/versions/Sound-Smarter"
DIST_ZIP="dist.zip"
USERNAME="$SUDO_USER"
PACKAGE_JSON_PATH="$PROJECT_ROOT/package.json"
WWW_BUILD_PATH="$PROJECT_ROOT/src-capacitor/www"

# Function to ensure the script is run with sudo privileges
ensure_sudo() {
    if [[ $EUID != 0 ]]; then
        echo "[!] Please run this script as sudo"
        exit 1
    fi

    if [[ $SUDO_USER == "root" ]]; then
        if [[ $1 == "--ignore" ]]; then
            echo "[!] Running as root, this may destroy file permissions"
        else
            echo "[!] Please do not run this script as root"
            echo "You may pass the --ignore flag to continue"
            exit 1
        fi
    fi
}

# Function to build the application
build_app() {
    echo "[!] Compiling as $USERNAME"
    su - $USERNAME bash -c "cd $PROJECT_ROOT; npm run build-capacitor"
    RESPONSE_CODE=$?
    if [[ $RESPONSE_CODE -ne 0 ]]; then
        echo "Error occurred while building application"
        exit $RESPONSE_CODE
    fi
    echo "[!] Compiled static web-application"
}

# Function to copy the build and version it
copy_build_version() {
    echo "[!] Deleting old dist"
    rm -f $DIST_ZIP

    echo "[!] Get version number from package.json"
    VERSION_NUMBER=$(jq -r '.version' "$PACKAGE_JSON_PATH")
    if [ -z "$VERSION_NUMBER" ]; then
        echo "[!] Error: Version number not found in package.json"
        exit 1
    fi
    echo "[!] Version number: $VERSION_NUMBER"

    VERSIONED_BUILD_DIR="$BUILD_DIR_DEST/$VERSION_NUMBER"
    echo "[!] Deleting old version in $VERSIONED_BUILD_DIR"
    rm -rf $VERSIONED_BUILD_DIR

    echo "[!] Creating directory $VERSIONED_BUILD_DIR"
    mkdir -p $VERSIONED_BUILD_DIR

    echo "[!] Moving Client Details into $WWW_BUILD_PATH"
    cp -r $BUILD_DIR_SRC/* "$WWW_BUILD_PATH"

    echo "[!] Zipping build folder to $DIST_ZIP"
    zip -r $DIST_ZIP "$WWW_BUILD_PATH"

    echo "[!] Copying new zip build to $VERSIONED_BUILD_DIR"
    cp $DIST_ZIP $VERSIONED_BUILD_DIR
}

# Function to change ownership of the build files
chown_build() {
    VERSIONED_BUILD_DIR="$BUILD_DIR_DEST/$VERSION_NUMBER"
    echo "[!] Changing file permissions of $VERSIONED_BUILD_DIR to www-data:www-data"
    chown -R www-data:www-data $VERSIONED_BUILD_DIR
}

# Main function to orchestrate the script
main() {
    ensure_sudo
    cd $PROJECT_ROOT
    git pull
    build_app
    copy_build_version
    chown_build
    echo "[!] Production build of version $VERSION_NUMBER complete"
    cd $START_DIR
    exit 0
}

# Run the main function
main
