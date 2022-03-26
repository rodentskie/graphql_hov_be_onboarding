#!/bin/bash

if [ -d "./build" ] 
then
    cd build
    npm install
    node build/index
else
    npm install
    node index
fi