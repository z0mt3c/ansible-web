var gulp = require('gulp');
var config = require('../config').less;
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var less = require('gulp-less');
var handleErrors = require('../utils/handleErrors');

gulp.task('less', function() {
    return gulp.src(config.src)
        .pipe(less({
            paths: config.paths
        }))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}));
});
