#! /bin/bash
source /TeaFluff/.env
git config --global user.name $user
git config --global user.password $passwd
cd TeaFluff
# git init
# git fetch
# git pull
npm install
npm start