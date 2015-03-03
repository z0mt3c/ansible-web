var gulp = require('gulp');
var config = require('../config').production;
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-filesize');

gulp.task('minify', ['less'], function() {
    return gulp.src(config.cssSrc, {base: config.dest})
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
})
