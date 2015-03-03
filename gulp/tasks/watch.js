var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['watchify', 'browserSync'], function() {
    gulp.watch(config.less.watch, ['less']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.markup.src, ['markup']);
});
