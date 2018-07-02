#!/usr/bin/env node

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const argv = require('yargs')
  .usage(`
    How to use:
      - crawl: nettruyen crawl -c <comic-handle> -p <parallel_download>
      - server: nettruyen server <port>
  `)
  .argv;

global.isCli = true;

const originArgs = process.argv;
let args = [];
if (originArgs[0].indexOf('nettruyen') > -1) {
  args = originArgs;
} else {
  //for debug
  args = originArgs.splice(2);
  args.unshift('nettruyen');
}

if (args[1] == 'crawl') {
  require('./crawl');
}

if (args[1] == 'serve') {
  let port = args[2];
  process.env.PORT = port;
  require('./server');
}
