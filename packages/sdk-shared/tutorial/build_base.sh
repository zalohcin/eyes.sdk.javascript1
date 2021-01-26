#!/bin/bash
set -e
DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

docker build -t tutorial_nodejs -f "${DIR}"/base/Dockerfile "${DIR}"/base
