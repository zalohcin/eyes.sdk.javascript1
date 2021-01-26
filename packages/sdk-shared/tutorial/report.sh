#!/bin/bash

function report() {
#  echo "$@"
  data=$( dataMain $1 $2 $3 )'"results": [{
          "test_name": "tutorial_basic",
          "passed": '$(exitCodeToBool $4)'
        },
        {
          "test_name": "tutorial_ultrafastgrid",
          "passed": '$(exitCodeToBool $5)'
        }
      ]
}'
sendReport $data
}

function report_ufg() {
#  echo "$@"
  data=$( dataMain $1 $2 $3 )'"results": [{
          "test_name": "tutorial_ultrafastgrid",
          "passed": '$(exitCodeToBool $4)'
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
#    echo $payload
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST --data "$payload" "http://sdk-test-results.herokuapp.com/result"
}

function exitCodeToBool(){
  if [[ $1 == 0 ]]; then
    echo 'true'
  else
    echo 'false'
  fi
}
