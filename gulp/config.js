var dest = './build';
var src = './app';

/*
 Resources:
 - https://github.com/greypants/gulp-starter/tree/master/gulp/tasks
 - http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html
 */

module.exports = {
    browserSync: {
        server: {
            baseDir: dest
        }
    },
    less: {
        src: src + '/styles/main.less',
        watch: src + '/styles/**.less',
        dest: dest + '/styles'
    },
    markup: {
        src: src + '/*.html',
        dest: dest
    },
    images: {
        src: src + '/images/**',
        dest: dest + '/images'
    },
    fonts: {
        src: './node_modules/font-awesome/fonts/*',
        dest: dest + '/fonts'
    },
    clean: {
        dest: dest
    },
    browserify: {
        bundleConfigs: [
            {
                entries: [src + '/scripts/main.jsx'],
                transform: [require('reactify'), require('es6ify').configure(/.jsx/)],
                extensions: ['.jsx'],
                dest: dest + '/scripts',
                outputName: 'main.js'
            }
        ]
    },
    production: {
        cssSrc: dest + '/styles/*.css',
        jsSrc: dest + '/scripts/*.js',
        dest: dest
    }
};
