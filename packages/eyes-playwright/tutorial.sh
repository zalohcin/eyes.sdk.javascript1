#!/bin/bash
set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_playwright_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_playwright_sdk --build-arg repo=tutorial-playwright-basic -t tutorial_playwright_basic -f ../sdk-shared/tutorial/Dockerfile .
docker build --build-arg from=tutorial_playwright_sdk --build-arg repo=tutorial-playwright-ultrafastgrid -t tutorial_playwright_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY tutorial_playwright_basic /bin/bash -c ' find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && //bootstrap.sh > /dev/null 2>&1 && npm test'
basic=$?
docker run -e APPLITOOLS_API_KEY tutorial_playwright_ultrafastgrid /bin/bash -c ' find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}
report playwright "$report_id" "$sandbox" $basic $ultrafastgrid

