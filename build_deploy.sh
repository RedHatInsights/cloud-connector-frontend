#!/bin/bash

# To debug run like this:
# QUAY_REPOSITORY="openshift-unified-hybrid-cloud/web-rca-ui" QUAY_TOKEN=$(cat .quay-pass) QUAY_USER=martin_povolny ./build_deploy.sh
#

# exit when any command fails
set -e

REPO="${QUAY_REPOSITORY:-TODO/TODO}"

# The version should be the short hash from git. This is what the deployent process expects.
VERSION="$(git log --pretty=format:'%h' -n 1)"

# Build metadata
echo "{
  \"app_name\": \"cloud-connector-frontend\",
  \"src_hash\": \"$VERSION\",
}" > app.info.json

# Log in to the image registry:
if [ -z "${QUAY_USER}" ]; then
  echo "The 'quay.io' push user name hasn't been provided."
  echo "Make sure to set the 'QUAY_USER' environment variable."
  exit 1
fi
if [ -z "${QUAY_TOKEN}" ]; then
  echo "The 'quay.io' push token hasn't been provided."
  echo "Make sure to set the 'QUAY_TOKEN' environment variable."
  exit 1
fi

# Build and Push the image:
podman build -t quay.io/${REPO}:${VERSION} -f ./Dockerfile
podman push --creds=${QUAY_USER}:${QUAY_TOKEN} quay.io/${REPO}:${VERSION}