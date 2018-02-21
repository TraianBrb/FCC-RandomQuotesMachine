function ready() {
  let data;
  var req = new XMLHttpRequest();

  if (!localStorage.selectedQuotes || localStorage.selectedQuotes == 'undefined') {
    localStorage.setItem('selectedQuotes', '[]');
  }

  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // do something
    }
  };

  req.open("GET", "javascript/quotes.json", true);

  req.onload = function() {
    data = JSON.parse(req.responseText);

    // Inject quotes in html
    var url = window.location.href;
    var selection = url.split('selection=').pop();
    var item = document.getElementById('reference-object').getElementsByClassName('random-quote__container')[0];
    var results = document.getElementsByClassName('quotes-main')[0];
    // For each quote, clone the reference object and inject quotes + author
    data[selection].forEach(function(obj) {
      var clone = item.cloneNode(true);

      results.appendChild(clone);
      clone.getElementsByClassName('random-quote__quote')[0].innerHTML = obj.quote;
      clone.getElementsByClassName('quote-author')[0].innerHTML = obj.author;
    });

    //  Carousel block
    $('.quotes-main').slick( {
      arrows: false,
      mobileFirst: true
    });

    // ////////////////
    // Add to bookmarks
    // ////////////////

    var myBookmarks = [];

    $('.random-quote-buttons__bookmark').click(function() {
      var data;
      var quote = $(this).parent().siblings('.random-quote__main').children('.random-quote__quote').text();
      var author = $(this).parent().siblings('.random-quote__main').children('.quote-author').text();
      var date = new Date();
      var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()];
      var str = 'on ' + date.getDate() + ' ' + month + ' ' + date.getFullYear();
      if (!myBookmarks) {
        myBookmarks = [];
      };
      if (localStorage.selectedQuotes && localStorage.selectedQuotes !== undefined) {
        data = JSON.parse(localStorage.selectedQuotes);
        var x;
        for (i = 0; i < data.length; i++) {
          if (quote == data[i].quote) {
            x = i;
            data.splice(x, 1);
            // localStorage.selectedQuotes = JSON.stringify(data);
            myBookmarks = data;
            saveQuotes();
            $(this).children().replaceWith('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="32" viewBox="0 0 16 32"><path fill="#FFF" fill-rule="nonzero" d="M13.333 3.167v21.838a.5.5 0 0 1-.83.376L8.33 21.716a.5.5 0 0 0-.66 0l-4.173 3.665a.5.5 0 0 1-.83-.376V3.167a.5.5 0 0 1 .5-.5h9.666a.5.5 0 0 1 .5.5zM15.5 0H.5a.5.5 0 0 0-.5.5v30.395a.5.5 0 0 0 .83.376l6.84-6.007a.5.5 0 0 1 .66 0l6.84 6.007a.5.5 0 0 0 .83-.376V.5a.5.5 0 0 0-.5-.5z"/></svg>')
            return;
          }
        }
      };
      myBookmarks.push({
        category: 'Feeling ' + selection,
        date: str,
        quote: quote,
        author: author
      });
      saveQuotes();
      // Changes the icon when the button is pressed
      $(this).children().replaceWith('<svg height="26px" viewBox="0 0 20 20" width="26px" <g fill="#FFF" fill-rule="evenodd" stroke="none" stroke-width="1"><path d="M5.9,8.1 L4.5,9.5 L9,14 L19,4 L17.6,2.6 L9,11.2 L5.9,8.1 L5.9,8.1 Z M18,10 C18,14.4 14.4,18 10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C10.8,2 11.5,2.1 12.2,2.3 L13.8,0.7 C12.6,0.3 11.3,0 10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 L18,10 L18,10 Z" fill="#FFF" /></svg>')
    });

    saveQuotes = function() {
      var selectedQuotes = JSON.stringify(myBookmarks);
      localStorage.selectedQuotes = selectedQuotes;
    };

    myBookmarks = localStorage.selectedQuotes;
    if(myBookmarks) {
      myBookmarks = JSON.parse(myBookmarks);
    } else {
      saveQuotes();
    }

    // //////////////
    // Twitter share
    // //////////////
    var shareBtn = $('.random-quote-buttons__share');
    shareBtn.click(function() {
      var quote = $(this).parent().parent().children('.random-quote__main').children('.random-quote__quote').text();
      var author = $(this).parent().parent().children('.random-quote__main').children('.quote-author').text();
      var toTweet = quote + ' - ' + author;
      toTweet = toTweet.replace(/ /g,'%20');
      var twitterUrl = 'https://twitter.com/intent/tweet?text=';
      window.open(twitterUrl + toTweet);
    });

  };

  $('.next-button').on('click', function() {
    $('.quotes-main').slick('slickNext');
  });

  $('.previous-button').on('click', function() {
    $('.quotes-main').slick('slickPrev');
  });

  req.send();

}

if (document.readyState !== 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready)
}
