Pictures = new Meteor.Collection("pictures");
Albums = new Meteor.Collection("albums");
var IDENTIFIER = "col";

Meteor.startup(function () {
  var imagesDirectory = "../client/app/albums";  
  var beginByIdentifier = "^"+IDENTIFIER+"[0-9]";
  var fs = Npm.require('fs');
  var prettyUrl = new URLify;
  var albumDirectory = fs.readdirSync(imagesDirectory);  
  Pictures.remove({});
  Albums.remove({});  
  function recordPictures(albumDirectory) {
    var pictures = fs.readdirSync(imagesDirectory + "/" + albumDirectory);
    for (var i = 0; i < pictures.length; i++) {
      var cover = pictures[i].match(beginByIdentifier) || {} ;
      albumUrl = prettyUrl.generate(albumDirectory);
      Pictures.insert({ fileName: pictures[i], path: albumDirectory, url: albumUrl, cover: cover[0],  index: i });
    }      
  }
  for (var i = 0; i < albumDirectory.length; i++) {
    recordPictures(albumDirectory[i]);
    albumUrl = prettyUrl.generate(albumDirectory[i]);
    Albums.insert({ title: albumDirectory[i], url: albumUrl }); // workaround since there's no Collection.find({}).distinct('myField', true);
  }   
});


