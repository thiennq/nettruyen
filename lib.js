const request = require('request');
const cheerio = require('cheerio');

function get(url) {
  return new Promise((r, _) => {
    request(url, function (error, response, body) {
      r(body);
    });
  });
}

async function listGenres() {
  let html = await get('http://www.nettruyen.com/tim-truyen');
  let $ = cheerio.load(html);
  let arr = $('.right-side.cmszone a').toArray().map(x => ({
    handle: $(x).attr('href').split('/').pop(),
    title: $(x).text()
  }));
  arr = arr.filter(item => item.handle != 'tim-truyen');
  return arr;
}

async function listComics(genre) {
  console.log('genre', genre);
  let html = await get('http://www.nettruyen.com/tim-truyen/' + genre);
  let $ = cheerio.load(html);
  let arr = $('figure').toArray().map(x => {
    let comic = $(x).find('h3 a');
    let chap = $(x).find('ul li:first-child a');
    return {
      handle: comic.attr('href').split('/').pop(),
      title: comic.text().trim(),
      chap: chap.text().trim()
    };
  });

  return arr;
}

async function comicAutocomplete(name) {
  let q = encodeURIComponent(name);
  let url = 'http://www.nettruyen.com/Comic/Services/SuggestSearch.ashx?q=' + q;
  let html = await get(url);
  
  let $ = cheerio.load(html);
  let arr = $('li').toArray().map(x => {
    let title = $(x).find('h3').text();
    let handle = $(x).find('a').attr('href').split('/').pop();
    let chap = $(x).find('h4 i:first-child').text();
    return {
      handle,
      title,
      chap
    };
  });
  return arr;
}

module.exports = {
  get,
  listGenres,
  listComics,
  comicAutocomplete
}
