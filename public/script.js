function pad(n, len) {
  let str = n + '';
  for (i = 0; i < len - str.length; i++, str = '0' + str);
  return str;
}

$.get('/chapters', function(res) {
  let html = res.map(chap => `<div class="chapter" data-chap="${chap}">chap ${chap}</div>`).join('');
  $('#chapter-list').html(html);
  console.log(res);
  let lastChap = Cookies.get('lastChap');
  gotoChap(lastChap);
});


$(document).on('click', '.chapter', function() {
  console.log('chapter clicked');
  $(this).addClass('active').siblings().removeClass('active');
  var chap = $(this).data('chap');
  Cookies.set('lastChap', chap);
  $('#reading').html('');
  $.get(`/chapters/${chap}`, function(res) {
    let html = res.map(page => `<div class="page"><img src="/${chap}/${page}" /></div>`).join('');
    $('#reading').html(html);
    $('#reading .page:first-child')[0].scrollIntoView();
  })
})

$(document).on('keyup', function(e) {
  console.log(e, e.key);
  if (e.key == "ArrowRight") {
    gotoNextChap();
  }
  if (e.key == "ArrowLeft") {
    gotoPrevChap();
  }
})

function getCurrentChap() {
  let current = $('.chapter.active').data('chap');
  return current - 0;
}

function gotoChap(n) {
  if (isNaN(n)) {
    $('.chapter:first-child').click();
  } else {
    $(`.chapter[data-chap=${n}]`).trigger('click');
  }
  $('#current-chap').text('Chapter ' + n);
}

function gotoNextChap() {
  let current = getCurrentChap();
  let next = pad(current + 1, 4);
  gotoChap(next);
}

function gotoPrevChap() {
  let current = getCurrentChap();
  let prev = pad(current - 1, 4);
  gotoChap(prev);
}
