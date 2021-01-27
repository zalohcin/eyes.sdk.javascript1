#!/bin/bash

set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_testcafe_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_testcafe_sdk --build-arg repo=tutorial-testcafe -t tutorial_testcafe -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY tutorial_testcafe /bin/bash -c 'sed -i "s/testConcurrency: 1/testConcurrency: 6/g" applitools.config.js&& //bootstrap.sh > /dev/null 2>&1 && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}

report_ufg testcafe "$report_id" "$sandbox" $ultrafastgrid

