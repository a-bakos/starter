'use strict';

/**
 * abakos - Gulp Setup
 */

// Load user/developer config file
const userConfig = require('./userConfig');

// Gulp plugins
const gulp = require('gulp');
const uglify = require('gulp-uglify'); // Babel does minification, do we really need uglify?
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const sizereport = require('gulp-sizereport');
const stripDebug = require('gulp-strip-debug');
const updateHumanstxtDate = require("gulp-update-humanstxt-date");
const humans = require('gulp-humans');
const svgStore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const sass = require('gulp-sass');
const notify = require('gulp-notify');

// Node packages
const del = require('del');
const bsync = require('browser-sync');

const log = console.log;

/**
 * Runs the SVG spriting process,
 * combines all SVGs into one SVG sprite
 */
gulp.task('svg', () => {
	return gulp.src([
		'dev/svg/*.svg'
	])
		.pipe(svgStore({ inlineSvg: true }))
		.pipe(svgmin({
			plugins:
			[{
				cleanupIDs: false
			}]
		}))
		.pipe(gulp.dest('build/svg'));
});

/**
 * Compress images
 */
const imagemin = require('gulp-imagemin');

gulp.task('img-opt', () => {
	return gulp.src('images/img/*')
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(gulp.dest('build/images'))
		.pipe(notify({
			"message": "Image optimization task complete",
			"onLast": true
		}))
});

/**
 * Strip debug information from JavaScript code:
 * console, alert, and debugger statements
 */
gulp.task('strip', () => {
	return gulp.src('dev/js/*.js')
		.pipe(stripDebug())
		.pipe(gulp.dest('dev/js'))
		.pipe(notify({
			"message": "Strip task complete",
			"onLast": true
		}))
});

/**
 * Concatenate and minify JavaScript files
 * Babel config in package.json @ babel
 */
const babel = require('gulp-babel');

gulp.task('scripts', () => {
	return gulp.src([
		'dev/js/*.js'
		])
		.pipe(sourcemaps.init())
		// Concatenate all JS files
		.pipe(concat('script.min.js'))
		.pipe(babel({
			// Transpile JS to pre ES6 version
			presets: ['env']
		}))
		// Minify the JS script
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('build/scripts'))
		.pipe(bsync.stream())
		.pipe(notify({
			"title": "Scripts task complete",
			"message": "Concatenate and minify JavaScript files",
			"onLast": true
		}))
});

/**
 * Lint the custom JavaScript files
 * Rules are in package.json @ eslintConfig
 * http://eslint.org/
  */
const eslint = require('gulp-eslint');

gulp.task('jslint', () => {
	return gulp.src([
		'./dev/js/*.js',
	])
		.pipe(eslint())
		.pipe(eslint.format('table'))
		.pipe(eslint.failAfterError())
		.pipe(notify({
			"message": "JS Lint task complete",
			"onLast": true
		}))
});

/*
IMPORTANT:

gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});
/*

/**
 * Prefix CSS
 */
const autoprefixer = require('gulp-autoprefixer');
// gulp.task('prefix', () =>
//     gulp.src('build/styles/style.css')
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//         .pipe(gulp.dest('build/styles'))
// );

/**
 * Compile and compress SCSS files into CSS,
 * prefix the code when needed,
 * and attach sourcemap
 */
gulp.task('styles', () => {
	return gulp.src('dev/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('build/css')) // Place the processed stylesheet in here
		.pipe(bsync.stream())
		// .pipe(notify({
		// 	"message": "Styles task complete",
		// 	"onLast": true
		// }))
});

// gulp.task('styles:watch', function (done) {
//   gulp.watch('./scss/**/*.scss', ['styles']);
// 	done();
// });

/**
 * Lint SASS
 */
const sassLint = require('gulp-sass-lint');

gulp.task('sasslint', function () {
	return gulp.src('dev/scss/**/*.s+(a|c)ss')
		.pipe(sassLint({
			options: {
				formatter: userConfig.sassLintDisplay()
			},
			configFile: '.sass-lint.yml'
		}))
		.pipe(sassLint.format())
		// Uncomment if you want Gulp to stop listening if encountered an error:
		// .pipe(sassLint.failOnError())
		.pipe(bsync.stream())
		//.pipe(notify({
		//	"message": "Sass Lint task complete",
		//	"onLast": true
		//}))
});

/**
 * Clean the 'build' directory
 */
gulp.task('clean', (done) => {
	return del(['build/*']);
	done();
});

/**
 * Size report - display the file sizes
 */
gulp.task('sizereport', () => {
	return gulp.src([
			'build/**/*'
			// 'images/**/*'
		])
		.pipe(sizereport({
			gzip: true
		}))
});

/**
 * Humans.txt
 * http://humanstxt.org/Standard.html
 */
gulp.task('human', () => {
	return gulp.src('index.php')
	.pipe(humans({
		site: [
			'Last update: 0000/00/00',
			userConfig.humansTXT.standards(),
			userConfig.humansTXT.components(),
			userConfig.humansTXT.software()
		],
		note: userConfig.humansTXT.note(),
		team: userConfig.humansTXT.team()
	}))
	.pipe(gulp.dest('./'))
	.pipe(notify({message: 'HumansTXT created'}));
});
/**
 * Update last modified date in humans.txt
 */
gulp.task('human-update', () => {
	return gulp.src('./humans.txt')
		.pipe(updateHumanstxtDate())
		.pipe(gulp.dest('./'));
		// .pipe(notify({message: 'HumansTXT updated'}));
});

/*
gulp.task("human-update", (done) => {
    return inquirer.prompt({
        type: 'confirm',
        message: 'want to update humans txt?',
        default: true,
        name: 'start'
    })
    .then((data) => {
    	if (data.start) {
	    	const updateHumanstxtDate = require("gulp-update-humanstxt-date");
    		return gulp.src("./humans.txt")
				.pipe(updateHumanstxtDate())
				.pipe(gulp.dest("dist"))
		}
    });
});
*/


/**
 * Browser sync
 *
 * We need to use 'proxy' to serve WordPress sites.
 * Proxy only works for existing vhosts.
 */

gulp.task('bsync', function(done) {
	bsync.init({
		proxy: userConfig.vhostProxy(),
		// Additional info about the process
		logLevel: "info", // "debug" | "warn" | "silent"
		logPrefix: userConfig.projectName(),
		// Log information about changed files
		logFileChanges: true
	});
	gulp.watch([
		'**/*.php',
		'**/*.html',
		'**/*.js',
		'**/*.scss',
		'**/*.css',
		'**/*.svg'
	]).on('change', bsync.reload);
	done();
});

/**
 * OKish
 * WordPress Lint
 * Lints .php files against WordPress VIP Coding Standards
 */
// https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards
// https://github.com/squizlabs/PHP_CodeSniffer
// composer!
const phpcs = require('gulp-phpcs');

gulp.task('wplint', () => {
	return gulp.src(
		[
			'./**/*.php',
			// Add exceptions here:
			'!node_modules/**/*.php',
			'!functions/debug.php'
		])
		// Validate files using PHP Code Sniffer
		.pipe(phpcs({
			bin: 'c:/users/' + userConfig.userName() + '/appdata/roaming/composer/vendor/bin/phpcs',
			standard: 'WordPress-VIP',
			warningSeverity: 0,
			showSniffCode: true,
			colors: true
		}))
		// Log all problems
		.pipe(phpcs.reporter('log'))
		// Write all problems into a report file
		.pipe(phpcs.reporter('file', { path: "log-phpcs-wpcs-report.txt" }))
		.pipe(bsync.stream())
		.pipe(notify({
			"message": "WordPress Lint task complete",
			"onLast": true
		}))
});

/**
 * Default task
 */
gulp.task('default',
	gulp.series(
		'clean',	// clean the build folder
		'sasslint',	// Sass linter
		//'wplint',	// WordPress linter
		'bsync',	// load BrowserSync
		gulp.parallel(/*'wplint', */'scripts', 'styles'/*, 'svg'*/),
		function watcher(done) {

			//gulp.watch(['**/*.php'], gulp.parallel('wplint'));
			gulp.watch(['dev/js/**/*.js'], gulp.parallel('scripts'));
			gulp.watch(['dev/scss/**/*.scss'], gulp.parallel('styles', 'sasslint'));
			//gulp.watch(['dev/svg/*.svg'], gulp.parallel('svg'));
			gulp.watch('build/**/*', bsync.reload);
			done();

		}
	)
);

gulp.task('notify-prod', function(done) {
	return gulp.src('**/*.*')
	.pipe(notify({
		"title": "Production build task complete",
		"message": "Assets ready for production",
		"onLast": true
	}));
	done();
});

/**
 * Build the assets for production
 */
gulp.task('build-prod',
	gulp.series(
		'clean',
//		'img-opt',
		'sasslint',
		'strip',
		gulp.parallel('scripts', 'styles', 'svg'),
		'human',
		'human-update',
		'sizereport',
		'notify-prod'
	)
);
