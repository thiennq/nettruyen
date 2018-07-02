const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const argv = require('yargs')
  .usage('contact me at: quangthien.cse10@gmail.com')
  .option( "s", { alias: "start", demand: false, describe: "start from ? chapter", type: "number" } )
  .option( "e", { alias: "end", demand: false, describe: "end at ? chapter", type: "number" } )
  .option( "p", { alias: "parallel", demand: false, describe: "end at ? chapter", type: "number" } )
  .option( "c", { alias: "comic", demand: false, describe: "handle of comic want to crawl", type: "string" } )
  .argv;

const CHAPTER_LIST_URL = argv.comic ? `http://www.nettruyen.com/truyen-tranh/${argv.comic}` : 'http://www.nettruyen.com/truyen-tranh/huyet-ma-nhan';
const CHAPTER_START = parseInt(argv.start) || 1;
const CHAPTER_END = parseInt(argv.end) || 9999;
const PARALLEL_DOWNLOAD = parseInt(argv.parallel) || 10;


let home = __dirname;
if (global.isCli) {
  console.log('running in a cli');
  home = process.cwd();
}

function get(url) {
  return new Promise((r, _) => {
    request(url, function (error, response, body) {
      r(body);
    });
  });
}


function download(url, path) {
  return new Promise((r, _) => {
    console.log(path);
    request(url).pipe(fs.createWriteStream(path)).on('finish', function() {
      r(true);
    });
  });
}


function pad(n, len) {
  let str = n + '';
  for (i = 0; i < len - str.length; i++) {
    str = '0' + str;
  }
  return str;
}

async function downloadFirst(folder, arr) {
  if (!arr || arr.length == 0) {
    return;
  }
  let item = arr.shift();
  let filePath = path.join(folder, `${pad(item.page, 4)}.png`);
  await download(item.url, filePath).then(_ => downloadFirst(folder, arr));
}

async function crawlChapter(chap, url) {
  let folder = path.join(home, 'chapters', pad(chap, 4));
  try {
    fs.mkdirSync(folder);
  } catch (e) {}



  let html = await get(url);
  let $ = cheerio.load(html);
  let arr = $('.page-chapter img').toArray().map(img => $(img).attr('src'));

  let jobs = arr.map((img, i) => ({url: img, page: i}));
  var pool = [];
  for (let i = 0 ; i < PARALLEL_DOWNLOAD; i++) {
    pool.push(downloadFirst(folder, jobs));
  }
  await Promise.all(pool);
}

async function main() {
  try {
    fs.mkdirSync(path.join(home, 'chapters'));
  } catch (e) {}

  let html = await get(CHAPTER_LIST_URL);
  let $ = cheerio.load(html);
  let arr = $('.list-chapter .chapter').toArray().map(dom => $(dom).find('a').attr('href')).reverse();
  for (let url of arr) {
    let ex = /chap\-(\d+)/.exec(url);
    let chap = ex[1] - 0;
    if (chap < CHAPTER_START || chap > CHAPTER_END) {
      continue;
    }

    await crawlChapter(chap, url);
  }
}


main();
