#!/bin/bash
set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_selenium_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

if [[ $APPLITOOLS_SELENIUM_MAJOR_VERSION == 3 ]]; then
  docker build --build-arg from=tutorial_selenium_sdk --build-arg repo=tutorial-selenium3-javascript-basic -t tutorial_selenium3_basic -f ../sdk-shared/tutorial/Dockerfile .
  docker build --build-arg from=tutorial_selenium_sdk --build-arg repo=tutorial-selenium3-javascript-ultrafastgrid -t tutorial_selenium3_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .
else
  docker build --build-arg from=tutorial_selenium_sdk --build-arg repo=tutorial-selenium-javascript-basic -t tutorial_selenium_basic -f ../sdk-shared/tutorial/Dockerfile .
  docker build --build-arg from=tutorial_selenium_sdk --build-arg repo=tutorial-selenium-javascript-ultrafastgrid -t tutorial_selenium_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .
fi

set +e

if [[ $APPLITOOLS_SELENIUM_MAJOR_VERSION == 3 ]]; then
  docker run -e APPLITOOLS_SELENIUM_MAJOR_VERSION -e APPLITOOLS_API_KEY tutorial_selenium3_basic /bin/bash -c '//bootstrap.sh > /dev/null 2>&1 && find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
  basic=$?
  docker run -e APPLITOOLS_SELENIUM_MAJOR_VERSION -e APPLITOOLS_API_KEY tutorial_selenium3_ultrafastgrid /bin/bash -c '//bootstrap.sh > /dev/null 2>&1 && find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
  ultrafastgrid=$?
else
  docker run -e APPLITOOLS_API_KEY tutorial_selenium_basic /bin/bash -c '//bootstrap.sh > /dev/null 2>&1 && find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
  basic=$?
  docker run -e APPLITOOLS_API_KEY tutorial_selenium_ultrafastgrid /bin/bash -c '//bootstrap.sh > /dev/null 2>&1 && find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
  ultrafastgrid=$?
fi

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}

if [[ $APPLITOOLS_SELENIUM_MAJOR_VERSION == 3 ]]; then
    report js_selenium_3 "$report_id" "$sandbox" $basic $ultrafastgrid
else
    report js_selenium_4 "$report_id" "$sandbox" $basic $ultrafastgrid
fi
