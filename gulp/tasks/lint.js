var gulp = require('gulp');
var config = require('../config').lint;
var jshint = require('gulp-jshint');
var react = require('gulp-react');

gulp.task('lint', function () {
    gulp.src(config.src)
        .pipe(react())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});