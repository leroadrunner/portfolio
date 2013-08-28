////////// Tracking selected list in URL //////////

var PortfolioRouter = Backbone.Router.extend({
  routes: {
    ":album_title": "setAlbum"
  },
  setAlbum: function (album_title,index) {
    this.navigate(album_title, true);
    Session.set('currentPage', album_title);
    Session.set('carouselState', true);
    Session.set('carouselIndex', index);
  },      
  unsetAlbum: function () {
    this.navigate('/', true);
    Session.set('carouselState', false);
  }    
});

Router = new PortfolioRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});  
