javascript:(function(url) {
    var s = document.createElement('script');
    s.src = url;
    (document.getElementsByTagName('head')[0] ||
        document.getElementsByTagName('body')[0]).appendChild(s);
})('http://code.jquery.com/jquery-2.1.3.js');