#!/bin/bash

set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_webdriverio5_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_webdriverio5_sdk --build-arg repo=tutorial-webdriverio5-basic -t tutorial_webdriverio5_basic -f ../sdk-shared/tutorial/Dockerfile .
docker build --build-arg from=tutorial_webdriverio5_sdk --build-arg repo=tutorial-webdriverio5-ultrafastgrid -t tutorial_webdriverio5_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY tutorial_webdriverio5_basic /bin/bash -c 'find ./test -type f -exec sed -i "s/logLevel: '\''silent'\'',/logLevel: '\''silent'\'',\n hostname: '\''host.docker.internal'\''/g" {} \; && npm test'
basic=$?
docker run -e APPLITOOLS_API_KEY tutorial_webdriverio5_ultrafastgrid /bin/bash -c 'find ./test -type f -exec sed -i "s/logLevel: '\''silent'\'',/logLevel: '\''silent'\'',\n hostname: '\''host.docker.internal'\''/g" {} \; && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}
report js_wdio_5 "$report_id" "$sandbox" $basic $ultrafastgrid

