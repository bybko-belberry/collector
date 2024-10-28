const { src, dest, series } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
// const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const { server } = require('./server');
const webpack = require('webpack-stream');
const webpackConfig = require('../../webpack.config').createConfig;
const config = require('../config');

function jsCore () {
  return src(`${config.src}/index.js`)
    .pipe(gulpIf(!config.production, sourcemaps.init()))
    .pipe(plumber({
      errorHandler: config.errorHandler
    }))
    .pipe(webpack(webpackConfig(config.env)))
    .pipe(dest(config.dest.js))
    .pipe(server.reload({ stream: true }));
}

exports.jsCore = jsCore;

function jsVendor () {
  return src(`${config.src.js}/vendor/**/*.js`)
    .pipe(plumber({
      errorHandler: config.errorHandler
    }))
    .pipe(gulpIf(config.production, uglify()))
    .pipe(dest(config.dest.js))
    .pipe(server.reload({ stream: true }));
}

exports.jsVendor = jsVendor;

exports.js = series(jsVendor, jsCore);
