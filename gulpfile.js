'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

gulp.task('js', () => {
	return gulp.src('./src/vue-keyboard.js')
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('css', () => {
	return gulp.src('./src/vue-keyboard.scss')
		.pipe(sass({ style: 'compressed' }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
	gulp.watch('./src/vue-keyboard.js', ['js']);
	gulp.watch('./src/vue-keyboard.scss', ['css']);
});

gulp.task('default', ['js', 'css', 'watch']);