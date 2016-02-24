'use strict';

var gulp = require('gulp');
var crisper = require('gulp-crisper');
var del = require('del');
var polyclean = require('polyclean');
var vulcanize = require('gulp-vulcanize');

// Cleans the dist folder
gulp.task('clean', function () {
	del(['./dist', './.publish']);
});

gulp.task('build', ['clean'], function () {
	return gulp.src('./src/index.html')
		.pipe(vulcanize({
			abspath: '',
			inlineCss: true,
			inlineScripts: true,
			stripComments: true
		}))
		.pipe(polyclean.leftAlignJs())
		.pipe(polyclean.uglifyJs())
		.pipe(polyclean.cleanCss())
		.pipe(crisper())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
