'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('js', () => {
	return gulp.src('./src/vue-keyboard.js')
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
	gulp.watch('./src/vue-keyboard.js', ['js']);
});

gulp.task('default', ['js', 'watch']);