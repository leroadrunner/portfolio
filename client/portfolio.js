var Pictures = new Meteor.Collection("pictures");
var Albums = new Meteor.Collection("albums");
var sinterval = 3000  ;
var columns = 3;
var identifier = "col";
Session.setDefault('currentPage', 'UnderTheBridge');
Session.setDefault('carouselState', false);
Session.setDefault('menuState', false);

function collectionExtract(collection) {
  var result = [];  
  for ( var i=0; i < collection.length; i++) {
    result.push({ "picture": collection[i]['fileName'], "path": collection[i]['path'] });
  }
  return result;  
}  

// setup ( google analytics )
Template.setup.rendered = function() {
  (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  ga('create', 'UA-40144979-2', 'ronaldpauffert.fr');
  ga('send', 'pageview');
};

// coverPage
Template.coverPage.container = function () {
  var cover = [];    
  for (var i=1; i<=columns; i++) {
    var column = Pictures.find({column: identifier+i}, { sort: {fileName: 1}}).fetch();
    var colExtract = collectionExtract(column);
    cover.push({name: identifier+i, files: colExtract});  
  }       
  return cover;
};  

// albumsList
Template.albumsList.albums = function () {
  return Albums.find({}, {sort: { title: 1}}) ;
}

Template.albumsList.events({
  'click .menu-list': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
    var menuState = Session.get('menuState');
    if (menuState) {
      Session.set('menuState', false);
      $('#dropdown').removeClass( 'active' );
    } else {
      Session.set('menuState', true); 
      $('#dropdown').addClass( 'active' );
    }
  },
  'click .menu-item': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
    Router.setAlbum(this.title); 
  }
});

// carousel
Template.carousel.carouselState = function () {
  var carouselState = Session.get('carouselState');
  return carouselState;
};

Template.carousel.rendered = function () {
  $(document).ready(function(){
    $('.carousel').carousel({
      interval : sinterval
    });
  });  
};

Template.carousel.pictures = function () {
  var AlbumSes = Session.get('currentPage');
  return Pictures.find({path: AlbumSes}, {sort: { fileName: 1}}) ;
};

Template.carousel.events({
  'click .close': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
    Router.unsetAlbum();   
  }
});