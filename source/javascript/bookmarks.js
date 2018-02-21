function ready() {
  var item = document.getElementById('reference-object').getElementsByClassName('bookmarks-item-container')[0];
  var results = document.getElementsByClassName('bookmarks-list')[0];

  if (!localStorage.selectedQuotes) {
    var clone = item.cloneNode(true);

    results.appendChild(clone);
    clone.getElementsByClassName('quote-title-h3')[0].innerHTML = 'You have no favourite quote';
    clone.getElementsByClassName('date-of-bookmark')[0].innerHTML = ' ';
    clone.getElementsByClassName('bookmarked-quote')[0].innerHTML = 'Go to quotes categories and save your favourite quotes to bookmarks';
    clone.getElementsByClassName('bookmarked-quote-author')[0].innerHTML = ' ';
    clone.getElementsByClassName('bookmarks-buttons')[0].style.display = 'none';
  } else {
    var data = JSON.parse(localStorage.selectedQuotes);
    // For each quote, clone the reference object and inject quotes + author
    function injectBookmarks() {
      results.innerHTML = '';
      if (data.length > 0) {
        data.forEach(function(obj) {
          var clone = item.cloneNode(true);

          results.appendChild(clone);
          clone.getElementsByClassName('quote-title-h3')[0].innerHTML = obj.category;
          clone.getElementsByClassName('date-of-bookmark')[0].innerHTML = obj.date;
          clone.getElementsByClassName('bookmarked-quote')[0].innerHTML = obj.quote;
          clone.getElementsByClassName('bookmarked-quote-author')[0].innerHTML = obj.author;
        });
      } else {
        var clone = item.cloneNode(true);

        results.appendChild(clone);
        clone.getElementsByClassName('quote-title-h3')[0].innerHTML = 'You have no favourite quote';
        clone.getElementsByClassName('date-of-bookmark')[0].innerHTML = ' ';
        clone.getElementsByClassName('bookmarked-quote')[0].innerHTML = 'Go to quotes categories and save your favourite quotes to bookmarks';
        clone.getElementsByClassName('bookmarked-quote-author')[0].innerHTML = ' ';
        clone.getElementsByClassName('bookmarks-buttons')[0].style.display = 'none';
      }

      // Remove bookmarks
      var removeBtn = $('.remove-bookmark');
      removeBtn.click(function() {
        var toRemove = $(this).parent().parent().parent().children('.bookmarks-item').children('.bookmarked-quote').text();
        var x;
        for (var i = 0; i < data.length; i++) {
          if (data[i].quote === toRemove) {
            x = i;
          }
        }
        data.splice(x, 1);
        localStorage.selectedQuotes = JSON.stringify(data);
        injectBookmarks();
      });

      // Twitter Share bookmark
      var shareBtn = $('.share-bookmark');
      shareBtn.click(function() {
        var quote = $(this).parent().parent().parent().children('.bookmarks-item').children('.bookmarked-quote').text();
        var author = $(this).parent().parent().parent().children('.bookmarks-item').children('.bookmarked-quote-author').text();
        var toTweet = quote + ' - ' + author;
        toTweet = toTweet.replace(/ /g,'%20');
        var twitterUrl = 'https://twitter.com/intent/tweet?text=';
        window.open(twitterUrl + toTweet);
      });

    }
    injectBookmarks();
  }
}

if (document.readyState !== 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready)
}
