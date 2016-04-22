var gulp = require('gulp'),
  tap = require('gulp-tap'),
  template = require('gulp-template'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  header = require('gulp-header'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  fs = require('fs');

var buildConfig = require('./config/build.config.js');
var pkg = require('./package.json');


function addJSIndent(file, t) {
  var addIndent = '  ';
  var filename = file.path.split('src/')[1];

  if (filename === 'xpager.prefix' || filename === 'xpager.suffix') {
    addIndent = '';
  }

  if (addIndent !== '') {
    var fileLines = fs.readFileSync(file.path).toString().split('\n');
    var newFileContents = '';
    for (var i = 0; i < fileLines.length; i++) {
      newFileContents += addIndent + fileLines[i] + (i === fileLines.length ? '' : '\n');
    }
    file.contents = new Buffer(newFileContents);
  }
}

gulp.task('build', function(cb) {

  gulp.src(buildConfig.scripts)
    .pipe(tap(function(file, t) {
      addJSIndent(file, t);
    }))
    .pipe(template({ pkg: pkg }))
    .pipe(sourcemaps.init())
    .pipe(concat(buildConfig.filename + '.js'))
    .pipe(header(buildConfig.banner, {
      pkg: pkg,
      date: buildConfig.date
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulp.dest(buildConfig.paths.build))
    .pipe(uglify())
    .pipe(header(buildConfig.banner, {
      pkg: pkg,
      date: buildConfig.date
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildConfig.paths.build))
    .pipe(connect.reload())
    .on('end', function() {
      cb();
    });
});
