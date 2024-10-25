// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

// Set the port
app.set('port', 3000);

// Set the path to static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the path to views
app.set('views', path.join(__dirname, 'views'));

// Set the view engine
app.set('view engine', 'ejs');

// Set the path to the comments file
var commentsPath = path.join(__dirname, 'data/comments.json');

// Read the comments from the file
function readComments(callback) {
  fs.readFile(commentsPath, 'utf8', function(err, data) {
    if (err) {
      return callback(err);
    }
    var comments = JSON.parse(data);
    callback(null, comments);
  });
}

// Write the comments to the file
function writeComments(comments, callback) {
  fs.writeFile(commentsPath, JSON.stringify(comments, null, 2), 'utf8', function(err) {
    callback(err);
  });
}

// Get the comments from the file
app.get('/comments', function(req, res) {
  readComments(function(err, comments) {
    if (err) {
      return res.status(500).send('Error reading comments');
    }
    res.json(comments);
  });
});

// Post a comment
app.post('/comments', bodyParser.json(), function(req, res) {
  readComments(function(err, comments) {
    if (err) {
      return res.status(500).send('Error reading comments');
    }
    comments.push(req.body);
    writeComments(comments, function(err) {
      if (err) {
        return res.status(500).send('Error writing comments');
      }
      res.sendStatus(200);
    });
  });
});

// Render the index view
app.get('/', function(req, res) {
  res.render('index');
});

// Start the server
app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port'));
});