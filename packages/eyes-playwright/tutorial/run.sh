#!/bin/bash
source ../../sdk-shared/tutorial/report.sh
source ../../sdk-shared/tutorial/parse.sh
parse "$@"
set -e
[ -d "./package" ] && rm -r ./package
mkdir package
cd ..
yarn pack
package=$(find applitools*.tgz)
mv "$package" ./tutorial/package/"$package"
cd ./tutorial
docker-compose build $1
docker-compose run playwright_basic
docker-compose run playwright_ultrafastgrid

sandbox=${sandbox:-true}
report_id=${report_id:-$(uuidgen)}
report playwright "$report_id" "$sandbox"
