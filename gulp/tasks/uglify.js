var gulp = require('gulp');
var config = require('../config').production;
var size = require('gulp-filesize');
var uglify = require('gulp-uglify');

gulp.task('uglify', ['browserify'], function() {
    return gulp.src(config.jsSrc, {base: config.dest})
        .pipe(uglify())
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});
