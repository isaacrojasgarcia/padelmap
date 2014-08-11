var gulp = require('gulp');
var spawn = require('child_process').spawn;

var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('bundle', function() {
	return gulp.src('app/**/*.js')
			.pipe(browserify({
				debug: (process.env.NODE_ENV !== 'production')
			}))
			.pipe(rename('admin.js'))
			.pipe(gulp.dest('admin/public/js'))
});

gulp.task('nodemon', function() {
	spawn('nodemon', [], {
		stdio: 'inherit'
	})
});

// gulp.task('celery', function() {
// 	spawn('npm', ['run', 'celery'], {
// 		stdio: 'inherit'
// 	})
// });

gulp.task('watch', function() {
	gulp.watch('admin/app/**/*.js', ['bundle']);
	gulp.watch('node_modules/ramson-client/src/**/*.js', ['bundle']);
});

gulp.task('default', ['bundle']);
gulp.task('run', ['bundle'], function() {
	gulp.start('nodemon', 'watch');
});
gulp.task('dev', ['bundle'], function() {
	gulp.start('celery', 'nodemon', 'watch');
});
