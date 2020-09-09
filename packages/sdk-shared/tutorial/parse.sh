#!/bin/bash

function parse() {
  echo 'From parse'
  while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        eval $param="$2"
        # echo $1 $2 // Optional to see the parameter:value result
   fi
  shift
done
}
