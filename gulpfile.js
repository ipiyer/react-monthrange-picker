"use strict";

const gulp = require("gulp"),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  livereload = require("gulp-livereload"),
  connect = require('gulp-connect'),
  gutil = require('gulp-util'),
  paths = {
    sass: ['./src/css/sass/*.scss'],
    sass_includes: ['./src/css/sass_includes/*.scss']
  },
  watchify = require("watchify"),
  browserify = require("browserify"),
  babelify = require("babelify"),
  assign = require('lodash.assign'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  packageManifest = require('./package.json');;

gulp.task("build-css", function() {
  gulp.src(paths.sass)
    .pipe(plugins.compass({
      css: 'src/css',
      sass: 'src/css/sass',
      import_path: 'src/css/sass_includes'
    }))
    .once('error', function(err) {
      console.log(err);
    })
    .pipe(plugins.livereload());
});


var appDeps = Object.keys(packageManifest.dependencies);
console.log(appDeps)
  // add custom browserify options here
var customOpts = {
  entries: ["./src/index.jsx"],
  extensions: ['.js', '.jsx'],
  // entries: paths.pageJS,
  debug: true,
  cache: {},
  packageCache: {}
};

var b = browserify(customOpts)
b.transform(babelify.configure({
  presets: ["es2015", "react"]
}));
// var opts = assign({}, watchify.args, customOpts);
// var b = watchify(browserify(opts));
b.external(appDeps);
// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('jsx', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({
      loadMaps: true
    })) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./src'))
    .pipe(livereload());
}


gulp.task('server', function() {
  connect.server({
    root: 'src',
    port: '9999',
  });
});

gulp.task("dev", ["server", "jsx", "build-css", "watch"]);


gulp.task('watch', function() {
  plugins.livereload.listen({
    interval: 1000
  });

  gulp.watch(paths.sass.concat(paths.sass_includes), {
    usePolling: true
  }, ['build-css']);

});
