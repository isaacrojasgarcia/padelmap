var gulp = require('gulp');
var spawn = require('child_process').spawn;

var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('bundle', function() {
	return gulp.src('api/*.js')
			.pipe(browserify({
				debug: (process.env.NODE_ENV !== 'production')
			}))
			.pipe(rename('api.js'))
			.pipe(gulp.dest('dist/'))
});

gulp.task('nodemon', function() {
	spawn('nodemon', [], {
		stdio: 'inherit'
	})
});

gulp.task('watch', function() {
	gulp.watch('api/*.js', ['bundle']);
});

gulp.task('default', ['bundle']);
gulp.task('run', ['bundle'], function() {
	gulp.start('nodemon', 'watch');
});