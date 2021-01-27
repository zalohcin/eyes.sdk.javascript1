#!/bin/bash
set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_nightwatch_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_nightwatch_sdk --build-arg repo=tutorial-nightwatch-basic -t tutorial_nightwatch_basic -f ../sdk-shared/tutorial/Dockerfile .
docker build --build-arg from=tutorial_nightwatch_sdk --build-arg repo=tutorial-nightwatch-ultrafastgrid -t tutorial_nightwatch_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY tutorial_nightwatch_basic /bin/bash -c 'sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" nightwatch.conf.js && sed -i "s/port: 4444,/host: '\''host.docker.internal'\'',\n port: 4444,/g"  nightwatch.conf.js && npm test'
basic=$?
docker run -e APPLITOOLS_API_KEY tutorial_nightwatch_ultrafastgrid /bin/bash -c 'sed -i "s/port: 4444,/host: '\''host.docker.internal'\'',\n port: 4444,/g"  nightwatch.conf.js && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}
report nightwatch "$report_id" "$sandbox" $basic $ultrafastgrid

