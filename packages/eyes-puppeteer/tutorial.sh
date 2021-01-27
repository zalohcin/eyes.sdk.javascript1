#!/bin/bash
set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_puppeteer_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_puppeteer_sdk --build-arg repo=tutorial-puppeteer-basic -t tutorial_puppeteer_basic -f ../sdk-shared/tutorial/Dockerfile .
docker build --build-arg from=tutorial_puppeteer_sdk --build-arg repo=tutorial-puppeteer-ultrafastgrid -t tutorial_puppeteer_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY -e "PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome" tutorial_puppeteer_basic /bin/bash -c '//bootstrap.sh > /dev/null 2>&1  && npm test'
basic=$?
docker run -e APPLITOOLS_API_KEY -e "PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome" tutorial_puppeteer_ultrafastgrid /bin/bash -c '//bootstrap.sh > /dev/null 2>&1  && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}
report puppeteer "$report_id" "$sandbox" $basic $ultrafastgrid

