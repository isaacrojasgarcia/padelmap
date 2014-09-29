var gulp = require('gulp');
var spawn = require('child_process').spawn;

var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

// Styles stuff
gulp.task('styles', function () {
    gulp.src('app/**/*.css')
    	.pipe(concat('app.min.css'))
        // .pipe(cssmin())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts-frontend', function () {
    gulp.src('app/public/**/*.js')
        .pipe(concat('app.min.js'))
        // .pipe(cssmin())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

// Clean all builds
gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

gulp.task('nodemon', function() {
	spawn('nodemon', [], {
		stdio: 'inherit'
	})
});

gulp.task('watch', function() {
	gulp.watch('app/*.js', ['bundle']);
});

gulp.task('run', ['clean'], function() {
    gulp.start('styles');
	gulp.start('scripts-frontend');
	gulp.start('nodemon', 'watch');
});

gulp.task('default', ['styles']);