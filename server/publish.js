Pictures = new Meteor.Collection("pictures");
Albums = new Meteor.Collection("albums");
var IDENTIFIER = "col";

Meteor.startup(function () {
  var imagesDirectory         = "../client/app/albums";  
  var beginByIdentifier       = "^"+IDENTIFIER+"[0-9]";
  var fs                      = Npm.require('fs');
  var prettyUrl               = new URLify;
  var albumDirectory          = fs.readdirSync(imagesDirectory);  

  // clean the DB and scan the directory for new pics
  Pictures.remove({});
  Albums.remove({});  

  function recordPictures(albumDirectory,albumUrl) {
    var pictures = fs.readdirSync(imagesDirectory + "/" + albumDirectory);
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
  for (var i = 0; i < albumDirectory.length; i++) {
    albumUrl = prettyUrl.generate(albumDirectory[i]);
    recordPictures(albumDirectory[i],albumUrl);
    // build album list for the menu
    Albums.insert({ 
      title: albumDirectory[i], 
      url: albumUrl 
    }); // workaround since there's no Collection.find({}).distinct('myField', true);
  }   
});


