#!/bin/bash

function report() {
  echo "$@"
  data=$( dataMain $1 $2 $3 )'"results": [{
          "test_name": "tutorial_basic",
          "passed": true
        },
        {
          "test_name": "tutorial_ultrafastgrid",
          "passed": true
        }
      ]
}'
sendReport $data
}

function report_ufg() {
  echo "$@"
  data=$( dataMain $1 $2 $3 )'"results": [{
          "test_name": "tutorial_ultrafastgrid",
          "passed": true
        }
      ]
}'
sendReport $data
}

function dataMain() {
    echo '{
      "sdk":"'"$1"'",
      "group":"selenium",
      "id":"'$2'",
      "sandbox":'$3',
      "mandatory":false,'
}

function sendReport() {
    payload=''$@''
    echo $payload
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST --data "$payload" "http://sdk-test-results.herokuapp.com/result"
}
