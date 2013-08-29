Pictures        = new Meteor.Collection("pictures");
Albums          = new Meteor.Collection("albums");
var IDENTIFIER  = "col";
var IMAGE_DIR   = "../client/app/albums";  

Meteor.startup(function () {

  var beginByIdentifier       = "^"+IDENTIFIER+"[0-9]";
  var fs                      = Npm.require('fs');
  var prettyUrl               = new URLify;
  var albumDirectory          = fs.readdirSync(IMAGE_DIR);  

  // clean the DB and scan the directory for new pics
  Pictures.remove({});
  Albums.remove({});  

  function recordPictures(albumDirectory,albumUrl) {
    var pictures = fs.readdirSync(IMAGE_DIR + "/" + albumDirectory);
    pictures.forEach(function(picture, index) {
      Pictures.insert({ 
        fileName: picture, 
        path: albumDirectory,
        url: albumUrl,  
        cover: picture.match(beginByIdentifier) || {},
        index: index 
      });
    });         
  }

  albumDirectory.forEach(function(album) {
    albumUrl = prettyUrl.generate(album);
    recordPictures(album,albumUrl);
    // build album list for the menu
    Albums.insert({ 
      title: album, 
      url: albumUrl 
    }); // workaround since there's no Collection.find({}).distinct('myField', true);    
  });

});


