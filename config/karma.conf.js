module.exports = function(config) {
    config.set({
        basePath: '../',
        autoWatch: true,
        browsers: ['PhantomJS'],
        //browsers: ['Chrome'],
        frameworks: ['jasmine'],
        files: [
        //    JASMINE,
          //  JASMINE_ADAPTER,
            'app/lib/angular/angular.js',
            'app/lib/angular/angular-*.js',
            'test/lib/angular/angular-mocks.js',
            'app/js/**/*.js',
            'test/unit/**/*.js'
        ]
  });
};




/*
browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
*/
