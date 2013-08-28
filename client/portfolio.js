Pictures = new Meteor.Collection("pictures");
Albums = new Meteor.Collection("albums");
var INTERVAL = 3000  ;
var NB_COLUMNS = 3;
var IDENTIFIER = "col";
Session.setDefault('currentPage', 'UnderTheBridge');
Session.setDefault('carouselState', false);
Session.setDefault('menuState', false);
Session.setDefault('carouselIndex', 0);

function collectionExtract(collection) {
  var result = [];  
  for ( var i=0; i < collection.length; i++) {
    result.push({ "picture": collection[i]['fileName'], "path": collection[i]['path'] });
  }
  return result;  
}  

// setup ( google analytics )
Template.googleAnalytics.rendered = function() {
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
  var container = [];    
  for (var i=1; i<=NB_COLUMNS; i++) {
    container.push(IDENTIFIER+i) 
  }       
  return container;
}; 

Template.coverPage.pictures = function () {
  var selector = this.toString();
  return Pictures.find({cover: selector }, {sort: { fileName: 1}}) ;
};

Template.coverPage.events({
  'click .coveritem': function (evt) {
    Router.setAlbum(this.path,this.index); 
    console.log(this.index);
  }
});

// albumsList
Template.albumsList.albums = function () {
  return Albums.find({}, {sort: { title: 1}}) ;
}

Template.albumsList.events({
  'click .menu-list': function (evt) {
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
    Router.setAlbum(this.title,0); 
  }
});

// carousel
Template.carousel.carouselState = function () {
  var carouselState = Session.get('carouselState');
  return carouselState;
};

Template.carousel.rendered = function () {
  var carouselIndex = Session.get('carouselIndex');  
  $(document).ready(function(){
    $('.carousel').carousel({
      interval : INTERVAL
    });
    $('.carousel').carousel(carouselIndex);
  });  
  $('#'+carouselIndex).parent().addClass( 'active' );
};

Template.carousel.pictures = function () {
  var AlbumSes = Session.get('currentPage');
  return Pictures.find({path: AlbumSes}, {sort: { index: 1}}) ;
};

Template.carousel.events({
  'click .close': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
    Router.unsetAlbum();   
  }
});