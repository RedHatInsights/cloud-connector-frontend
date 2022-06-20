#!/bin/bash

# exit when any command fails
set -e

# try to build files
podman build --target=builder .