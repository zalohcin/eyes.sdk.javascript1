#!/bin/bash

function parse() {
  while [ $# -gt 0 ]; do
#   parse arguments --paramName paramValue
   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        eval $param="$2"
   fi
  shift
done
}
