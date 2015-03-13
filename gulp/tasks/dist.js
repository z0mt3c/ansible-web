var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('dist', function() {
    // This runs only if the karma tests pass
    gulp.start(['markup', 'images', 'fonts', 'minify', 'uglify'])
});
