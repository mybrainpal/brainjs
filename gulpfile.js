/**
 * Proudly created by ohad on 05/12/2016.
 */
    // grab our packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint');

// define the default task and add the watch task to it
gulp.task('default', ['build-js']);

// configure the jshint task
gulp.task('jshint', function () {
    return gulp.src('src/client/**/*.js')
               .pipe(jshint())
               .pipe(jshint.reporter('jshint-stylish'));
});

// configure js bundling
gulp.task('build-js', function () {
    return gulp.src('src/client/**/*.js')
               .pipe(sourcemaps.init())
               .pipe(concat('brain.js'))
               .pipe(babel({presets: ['es2015']}))
               //only uglify if gulp is ran with '--type production'
               .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
               .pipe(sourcemaps.write())
               .pipe(gulp.dest('dist'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function () {
    gulp.watch('src/client/**/*.js', ['jshint', 'build-js']);
});