#!/bin/bash
set -e
cd $( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ../sdk-shared/tutorial/report.sh
source ../sdk-shared/tutorial/parse.sh
parse "$@"
../sdk-shared/tutorial/build_base.sh
docker build -t tutorial_protractor_sdk -f ../sdk-shared/tutorial/Dockerfile.SDK .

docker build --build-arg from=tutorial_protractor_sdk --build-arg repo=tutorial-protractor-basic -t tutorial_protractor_basic -f ../sdk-shared/tutorial/Dockerfile .
docker build --build-arg from=tutorial_protractor_sdk --build-arg repo=tutorial-protractor-ultrafastgrid -t tutorial_protractor_ultrafastgrid -f ../sdk-shared/tutorial/Dockerfile .

set +e

docker run -e APPLITOOLS_API_KEY tutorial_protractor_basic /bin/bash -c 'sed -i "s/localhost/host.docker.internal/g" protractor.conf.js && find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
basic=$?
docker run -e APPLITOOLS_API_KEY tutorial_protractor_ultrafastgrid /bin/bash -c 'sed -i "s/localhost/host.docker.internal/g" protractor.conf.js && find ./test -type f -exec sed -i "s/'\''APPLITOOLS_API_KEY'\''/process.env.APPLITOOLS_API_KEY/g" {} \; && npm test'
ultrafastgrid=$?

sandbox=${sandbox:-true}
report_id=${APPLITOOLS_COVERAGE_REPORT_ID:-$(uuidgen)}
report protractor "$report_id" "$sandbox" $basic $ultrafastgrid

