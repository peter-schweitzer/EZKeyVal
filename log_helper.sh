#!/bin/bash

if test -f ./nohup.out; then
  mv ./nohup.out ./logs/"$(date '+%Y-%m-%d-%H-%M-%S')".log
fi
