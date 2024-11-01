#!/bin/bash

#Info
echo "[!] This script is for publishing the quasar vue project as a SPA Website"
echo "[!] Please ensure you have the following:"
echo "[!] user/Sound-Smarter/Client-Updater"
echo "[!] This is where you will run your git clone repo"
echo "[!] user/Sound-Smarter/Client-Details"
echo "[!] this is extra files you may want to add to your project"
echo "[!] Examples: sitemap.xml, favicon.ico, images..."
echo "[!] Ensure this script is runs in user/Sound-Smarter/Client-Updater/GithubRepoName"
echo "[!] Ensure you have nginx set up correctly to the /srv/www-data/Sound-Smarter/spa path."
#!/bin/bash

# Variables for paths and settings
directoryx=="$(dirname -- $(readlink -fn -- "$0"; echo x))"
PROJECT_ROOT="${directoryx=%x}"
START_DIR=$PWD
BUILD_DIR_SRC="dist/spa"
BUILD_DIR_STATIC_SRC="/home/user/Sound-Smarter/Client-Details"
BUILD_DIR_DEST="/srv/www-data/Sound-Smarter/spa"
USERNAME="$SUDO_USER"

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
build_www() {
    echo "[!] Compiling as $USERNAME"
    su - $USERNAME bash -c "cd $PROJECT_ROOT; npm run build-spa"
    RESPONSE_CODE=$?
    if [[ $RESPONSE_CODE -ne 0 ]]; then
        echo "Error occurred while building application"
        exit $RESPONSE_CODE
    fi
    echo "[!] Compiled static web-application"
}

# Function to copy the build files to the target directory
copy_build() {
    echo "[!] Removing old build from $BUILD_DIR_DEST"
    rm -rf $BUILD_DIR_DEST

    echo "[!] Creating new directory at $BUILD_DIR_DEST"
    mkdir -p $BUILD_DIR_DEST

    echo "[!] Copying new build to $BUILD_DIR_DEST"
    cp -r $BUILD_DIR_SRC/*  $BUILD_DIR_DEST

    echo "[!] Copying static files from $BUILD_DIR_STATIC_SRC to $BUILD_DIR_DEST"
    cp -r $BUILD_DIR_STATIC_SRC/* $BUILD_DIR_DEST
}

# Function to change ownership of the build files
chown_build() {
    echo "[!] Changing file permissions of $BUILD_DIR_DEST to www-data:www-data"
    chown -R www-data:www-data $BUILD_DIR_DEST
}

# Function to restart Nginx service
restart_nginx() {
    echo "[!] Restarting Nginx"
    systemctl restart nginx
    STATUS=$?
    if [[ $STATUS -ne 0 ]]; then
        echo "[!] Nginx failed to restart. Please see errors by running 'systemctl status nginx'"
        exit 1
    fi
    echo "[!] Nginx restarted successfully"
}

# Main function to orchestrate the script
main() {
    ensure_sudo
    cd $PROJECT_ROOT
    git pull
    build_www
    copy_build
    chown_build
    restart_nginx
    echo "[!] Production build of project complete"
    cd $START_DIR
    exit 0
}

# Run the main function
main
