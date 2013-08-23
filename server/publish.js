Pictures = new Meteor.Collection("pictures");
Albums = new Meteor.Collection("albums");
var columns = 3;
var identifier = "col";

Meteor.startup(function () {
  var imagesDirectory = "../client/app/albums";  
  var beginByIdentifier = "^"+identifier+"[0-9]";
  function recordPictures(albumDirectory) {
    var pictures = fs.readdirSync(imagesDirectory + "/" + albumDirectory);
    for (var i = 0; i < pictures.length; i++) {
      var column = pictures[i].match(beginByIdentifier) || {} ;
      Pictures.insert({ fileName: pictures[i], path: albumDirectory, column: column[0], isFirst: i === 0 });
    }      
  }
  Pictures.remove({});
  Albums.remove({});
  var fs = Npm.require('fs');
  var prettyUrl = new URLify;
  var albumDirectory = fs.readdirSync(imagesDirectory);
  for (var i = 0; i < albumDirectory.length; i++) {
    recordPictures(albumDirectory[i]);
    albumUrl = prettyUrl.generate(albumDirectory[i]);
    Albums.insert({ title: albumDirectory[i], url: albumUrl }); // workaround since there's no Collection.find({}).distinct('myField', true);
  }   
});


