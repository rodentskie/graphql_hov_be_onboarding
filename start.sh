#!/bin/bash

if [ -d "./build" ] 
then
    npm install
    node build/index
else
    npm install
    node index
fi