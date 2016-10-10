// Karma configuration
// Generated on Mon Oct 03 2016 13:29:36 GMT-0700 (PDT)

const packageManifest = require('./package.json');

const appDeps = Object.keys(packageManifest.dependencies);

const istanbul = require('browserify-istanbul');


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'test/components/*'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/components/*': ['browserify'],
    },
    browserify: {
      debug: true,
      transform: [
        istanbul({
          instrumenter: require('isparta'), // <--module capable of reading babelified code I think
          instrumenterConfig: {
            embedSource: true
          }, // what got it working
          ignore: ['**/node_modules/**']
        }), ['babelify', {
          presets: ['es2015', 'react'],
        }],
      ],
      extensions: ['.js', '.jsx'],
      configure: function(bundle) {
        bundle.on('prebundle', function() {
          bundle.external('react/addons');
          bundle.external('react/lib/ReactContext');
          bundle.external('react/lib/ExecutionEnvironment');
        });
      },
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],
    mochaReporter: {
      showDiff: true,
      colors: {
        success: 'green',
        info: 'bgGreen',
        warning: 'cyan',
        error: 'bgRed',
      },
      symbols: {
        success: '+',
        info: '#',
        warning: '!',
        error: 'x',
      },
    },

    coverageReporter: {
      reporters: [{
        type: 'html',
        dir: 'coverage/ui-coverage',
        subdir: 'html',
      }, {
        type: 'cobertura',
        dir: 'coverage/ui-coverage',
        subdir: 'cobertura',
      }, {
        type: 'text-summary',
      }, ],
    },

    thresholdReporter: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    client: {
      captureConsole: true,
      clearContext: false,
    },
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
}
