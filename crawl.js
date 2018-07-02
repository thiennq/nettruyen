const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const {get, listGenres, listComics, comicAutocomplete} = require('./lib');
var inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));


const argv = require('yargs')
  .usage('contact me at: quangthien.cse10@gmail.com')
  .option( "s", { alias: "start", demand: false, describe: "start from ? chapter", type: "number" } )
  .option( "e", { alias: "end", demand: false, describe: "end at ? chapter", type: "number" } )
  .option( "p", { alias: "parallel", demand: false, describe: "end at ? chapter", type: "number" } )
  .option( "c", { alias: "comic", demand: false, describe: "handle of comic want to crawl", type: "string" } )
  .argv;

var CHAPTER_LIST_URL = argv.comic ? `http://www.nettruyen.com/truyen-tranh/${argv.comic}` : '';
var CHAPTER_START = parseInt(argv.start) || 1;
var CHAPTER_END = parseInt(argv.end) || 9999;
var PARALLEL_DOWNLOAD = parseInt(argv.parallel) || 10;


let home = __dirname;
if (global.isCli) {
  console.log('running in a cli');
  home = process.cwd();
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
  while (str.length < len) str = '0' + str;
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

  if (!CHAPTER_LIST_URL) {
    let genres = await listGenres();


    genres.unshift({
      title: 'Tìm theo tên',
      handle: 'search-by-name'
    });

    let questions = [
        {
            type: 'list',
            name: 'genre',
            message: 'Select a genre to search:',
            choices: genres.map(item => item.title),
            default: 0
        }
    ];

    let selected = await inquirer.prompt(questions);
    let genre = genres.find(x => x.title == selected.genre);


    let comicSuggestions = [];


    if (genre.handle == 'search-by-name') {
      questions = [
          {
              type: 'autocomplete',
              name: 'comic',
              message: 'Select a comic to crawl:',
              source: async function(answersSoFar, input) {
                comicSuggestions = await comicAutocomplete(input);
                return comicSuggestions.map(x => `${x.title} | ${x.chap}`);
              },
              default: 0
          }
      ];
      selectedComic = await inquirer.prompt(questions);
    } else {
      let comics = comicSuggestions = await listComics(genre.handle);

      questions = [
          {
              type: 'list',
              name: 'comic',
              message: 'Select a comic to crawl:',
              choices: comics.map(item => item.title + ' | ' + item.chap),
              default: 0
          }
      ];

      let selectedComic = await inquirer.prompt(questions);
    }

    let comicTitle = selectedComic.comic.split(' | ')[0];
    let comic = comicSuggestions.find(x => x.title == comicTitle);
    console.log('select comic:', comic);

    CHAPTER_LIST_URL = `http://www.nettruyen.com/truyen-tranh/${comic.handle}`;
  }

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
