#!/bin/bash
set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_webdriverio_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_webdriverio_sdk --build-arg repo=tutorial-webdriverio-basic -t tutorial_webdriverio_basic -f ../sdk-shared/tutorial/Dockerfile .
docker build --build-arg from=tutorial_webdriverio_sdk --build-arg repo=tutorial-webdriverio-ultrafastgrid -t tutorial_webdriverio_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY tutorial_webdriverio_basic /bin/bash -c 'find ./test -type f -exec sed -i "s/desiredCapabilities: {/host: '\''host.docker.internal'\'',\ndesiredCapabilities: {/g" {} \; && npm test'
basic=$?
docker run -e APPLITOOLS_API_KEY tutorial_webdriverio_ultrafastgrid /bin/bash -c 'find ./test -type f -exec sed -i "s/desiredCapabilities: {/host: '\''host.docker.internal'\'',\ndesiredCapabilities: {/g" {} \; && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}
report js_wdio_4 "$report_id" "$sandbox" $basic $ultrafastgrid

