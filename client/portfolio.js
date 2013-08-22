Pictures = new Meteor.Collection("pictures");
Albums = new Meteor.Collection("albums");
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

// coverPage
Template.coverPage.container = function () {
  var cover = [];    
  for (i=1; i<=columns; i++) {
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