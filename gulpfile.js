"use strict";

const gulp = require("gulp"),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  livereload = require("gulp-livereload"),
  connect = require('gulp-connect'),
  gutil = require('gulp-util'),
  del = require('del'),
  paths = {
    sass: ['./src/css/sass/*.scss'],
    sass_includes: ['./src/css/sass_includes/*.scss']
  },
  watchify = require("watchify"),
  through = require("through"),
  browserify = require("browserify"),
  babelify = require("babelify"),
  assign = require('lodash.assign'),
  source = require('vinyl-source-stream'),
  glob = require("glob"),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  packageManifest = require('./package.json'),
  es = require('event-stream'),
  runSequence = require("run-sequence");

gulp.task("build-example-css", function() {
  gulp.src(paths.sass)
    .pipe(plugins.compass({
      css: 'src/css',
      sass: 'src/css/sass',
      import_path: 'src/css/sass_includes'
    }))
    .once('error', function(err) {
      console.log(err);
    })
    .pipe(gulp.dest('./example/css'))
    .pipe(plugins.livereload());
});

gulp.task("build-dist-css", function() {
  gulp.src(paths.sass)
    .pipe(plugins.compass({
      css: 'src/css',
      sass: 'src/css/sass',
      import_path: 'src/css/sass_includes'
    }))
    .once('error', function(err) {
      console.log(err);
    })
    .pipe(gulp.dest('./dist'));
});

const appDeps = Object.keys(packageManifest.dependencies);

gulp.task('build-vendor', function() {
  var b = browserify({
    debug: true,
    cache: {},
    packageCache: {}
  });

  b.require(appDeps);

  return b.bundle()
    .on('error', gutil.log.bind(gutil, "Browserify Vendor Error"))
    .pipe(source('vendor_bundle.js'))
    .pipe(gulp.dest("./dist"));
});

gulp.task('build-vendor-example', function() {
  var b = browserify({
    debug: true,
    cache: {},
    packageCache: {}
  });

  b.require(appDeps);

  return b.bundle()
    .on('error', gutil.log.bind(gutil, "Browserify Vendor Error"))
    .pipe(source('vendor_bundle.js'))
    .pipe(gulp.dest("./example/"));
});

gulp.task('build-dist-js', function() {
  var b = browserify({
    entries: ['./src/index.app.jsx'],
    extensions: ['.js', '.jsx'],
    debug: true,
    cache: {},
    packageCache: {}
  });

  b.external(appDeps);
  b.transform(babelify.configure({
    presets: ["es2015", "react"]
  }));

  return b.bundle()
    .on('error', gutil.log.bind(gutil, "Browserify Error"))

  .pipe(source('calendar.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
})


gulp.task('example', bundle);

var customOpts = {
  entries: ["./src/index.app.jsx"],
  extensions: ['.js', '.jsx'],
  debug: true,
  cache: {},
  packageCache: {}
};

var opts = assign({}, watchify.args, customOpts);

var b = watchify(browserify(opts));
b.transform(babelify.configure({
  presets: ["es2015", "react"]
}));

b.external(appDeps);

b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./example'))
    .pipe(livereload());
}


gulp.task('server', function() {
  connect.server({
    root: 'example',
    port: '9999',
  });
});

gulp.task('clean-dist', function() {
  return del('dist');
});

gulp.task("dev", ["server", "build-vendor-example", "build-example-css",
  "example",
  "watch"
]);

gulp.task("dist", function(callback) {
  runSequence(['clean-dist', 'build-vendor', 'build-dist-css',
      'build-dist-js'
    ],
    callback);
});

gulp.task('watch', function() {
  plugins.livereload.listen({
    interval: 1000
  });

  gulp.watch(paths.sass.concat(paths.sass_includes), {
    usePolling: true
  }, ['build-css']);

});
