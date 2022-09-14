#!/bin/bash
set -exuo pipefail

yarn
yarn test:ci
yarn build
