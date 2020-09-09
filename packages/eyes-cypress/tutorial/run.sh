#!/bin/bash
source ../../sdk-shared/tutorial/report.sh
source ../../sdk-shared/tutorial/parse.sh
parse "$@"
set -e
[ -d "./package" ] && rm -r ./package
echo $(ls)
mkdir package
cd ..
yarn pack
package=$(find applitools*.tgz)
mv "$package" ./tutorial/package/"$package"
cd ./tutorial
docker build $build -t tutorial_cypress .
docker run -e APPLITOOLS_API_KEY tutorial_cypress

sandbox=${sandbox:-true}
report_id=${report_id:-$(uuidgen)}
report_ufg cypress "$report_id" "$sandbox"
