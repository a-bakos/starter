'use strict';

/**
 * abakos - Gulp Setup
 *
 * To list all the available tasks, type:
 * gulp --tasks
 */

// Load user/developer configuration file
const userConfig = require( './userConfig' );
process.env.DISABLE_NOTIFIER = userConfig.gulpPopUps();

// Gulp plugins
const gulp = require( 'gulp' );
const uglify = require( 'gulp-uglify' ); // Babel does minification, do we really need uglify?
const concat = require( 'gulp-concat' );
const sourcemaps = require( 'gulp-sourcemaps' );
const sizereport = require( 'gulp-sizereport' );
const stripDebug = require( 'gulp-strip-debug' );
const svgStore = require( 'gulp-svgstore' );
const svgmin = require( 'gulp-svgmin' );
const sass = require( 'gulp-sass' );
const notify = require( 'gulp-notify' );

// Node packages
const del = require( 'del' );
const bsync = require( 'browser-sync' );

//const log = console.log;

/**
 * Runs the SVG spriting process,
 * combines all SVGs into one SVG sprite
 */
gulp.task(
	'svg', () => {
		return gulp.src([
			'dev/svg/*.svg'
		])
		.pipe( svgStore( { inlineSvg: true } ) )
		.pipe(
			svgmin({
				plugins:
				[{
					cleanupIDs: false
				}]
			})
		)
		.pipe( gulp.dest( 'build/svg' ) );
	}
);

/**
 * Compress images
 */
const imagemin = require( 'gulp-imagemin' );

gulp.task(
	'img-opt', () => {
		return gulp.src([ 'images/img/*' ])
		.pipe(
			imagemin([
				imagemin.gifsicle( { interlaced: true } ),
				imagemin.jpegtran( { progressive: true } ),
				imagemin.optipng( { optimizationLevel: 5 } ),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: true },
						{ cleanupIDs: false }
					]}
				)
			])
		)
		.pipe( gulp.dest( 'build/images' ) )
		.pipe(
			notify({
				"title": "[ img-opt ]",
				"message": "Optimize images.\nTask complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		)
	}
);

/**
 * Strip debug information from JavaScript code:
 * console, alert, and debugger statements.
 *
 * Replaces these with 'void 0', but minification
 * cuts them out as well.
 */
gulp.task(
	'strip', () => {
		return gulp.src([ 'dev/js/*.js' ])
		.pipe( stripDebug() )
		.pipe( gulp.dest( 'dev/js' ) )
		.pipe(
			notify({
				"title": "[ strip ]",
				"message": "Remove JS debug statements\nTask complete",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		)
	}
);

/**
 * Concatenate and minify JavaScript files
 * Babel config in package.json @ babel
 */
const babel = require( 'gulp-babel' );

gulp.task(
	'scripts', () => {
		return gulp.src([ 'dev/js/*.js' ])
		.pipe( sourcemaps.init() )
		.pipe( concat( 'script.min.js' ) ) // Concatenate all JS files
		.pipe( babel( { presets: ['env'] } ) ) // Transpile to pre ES6 version
		.pipe( uglify() ) // Minify the JS script
		.pipe( sourcemaps.write( '.' ) ) // Attach sourcemaps
		.pipe( gulp.dest( 'build/scripts' ) )
		.pipe( bsync.stream() )
		.pipe(
			notify({
				"title": "[ scripts ]",
				"message": "Concatenate, minify, attach sourcemaps, transpile JS files.\nTask complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		)
	}
);

/**
 * Lint the custom JavaScript files
 * Rules are in package.json @ eslintConfig
 * http://eslint.org/
  */
const eslint = require( 'gulp-eslint' );

gulp.task(
	'jslint', () => {
		return gulp.src([ './dev/js/*.js' ])
		.pipe( eslint() )
		.pipe( eslint.format( userConfig.jsLintDisplay() ) )
		.pipe( eslint.failAfterError() )
		.pipe(
			notify({
				"title": "[ jslint ]",
				"message": "JS lint task complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		)
	}
);

/*
IMPORTANT:

gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});
/*


/**
 * Compile and compress SCSS files into CSS,
 * prefix the code when needed,
 * and attach sourcemap
 */
const autoprefixer = require( 'gulp-autoprefixer' );

const devSassFiles = 'dev/scss/**/*.s+(a|c)ss'; // Sass source

gulp.task(
	'styles', () => {
		return gulp.src([ devSassFiles ])
		.pipe( sourcemaps.init() )
		.pipe(
			sass( { outputStyle: 'compressed' } )
				.on( 'error', sass.logError )
		)
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			})
		)
		.pipe( sourcemaps.write( '/' ) )
		.pipe( gulp.dest( 'build/css' ) ) // Place the processed stylesheet in here
		//.pipe( bsync.stream() )
		.pipe(
			notify({
				"title": "[ styles ]",
				"message": "Compile, compress, prefix, attach sourcemaps.\n Task complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		)
	}
);

/**
 * Lint SASS
 */
const sassLint = require( 'gulp-sass-lint' );

gulp.task(
	'sasslint', function () {
		return gulp.src([ devSassFiles ])
		.pipe(
			sassLint({
				options: {
					formatter: userConfig.sassLintDisplay()
				},
				configFile: '.sass-lint.yml'
			})
		)
		.pipe( sassLint.format() )
		// Uncomment if you want Gulp to stop listening if encountered an error:
		// .pipe(sassLint.failOnError())
		// .pipe( bsync.stream() )
		.pipe(
			notify({
				"title": "[ sasslint ]",
				"message": "Sass lint task complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch(),
				"timeout": 1
			})
		)
	}
);

/**
 * Clean the 'build' directory
 */
gulp.task(
	'clean', (done) => {
		return del([ 'build/*' ]);
		done();
	}
);

/**
 * Size report - display the file sizes
 */
gulp.task(
	'sizereport', () => {
		return gulp.src([
			'build/**/*'
			// 'images/**/*'
		])
		.pipe( sizereport( { gzip: true } ) )
	}
);

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
	.pipe(notify({
		"title": "[ human ]",
		"message": "HumansTXT created."
	}));
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

/**
 * Browser sync
 *
 * We need to use 'proxy' to serve WordPress sites.
 * Proxy only works for existing vhosts.
 */
gulp.task(
	'bsync', function(done) {
		bsync.init({
				proxy: userConfig.vhostProxy(),
				// Additional info about the process
				logLevel: "info", // "debug" | "warn" | "silent"
				logPrefix: userConfig.projectName(),
				// Log information about changed files
				logFileChanges: true,
				reloadDebounce: 600
		});
		gulp.watch([
			'**/*.php',
			'**/*.html',
			'**/*.js',
			'**/*.scss',
			'**/*.css',
			'**/*.svg'
		])
		.on( 'change', bsync.reload );
		done();
	}
);

/**
 * WordPress Lint
 * Lints .php files against WordPress VIP Coding Standards
 */
// https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards
// https://github.com/squizlabs/PHP_CodeSniffer
// composer!
const phpcs = require( 'gulp-phpcs' );

gulp.task(
	'wplint', () => {
		return gulp.src([
			'./**/*.php',
			// Add exceptions here:
			'!node_modules/**/*.php'
		])
		// Validate files using PHP Code Sniffer
		.pipe(
			phpcs({
				bin: 'c:/users/' + userConfig.userName() + '/appdata/roaming/composer/vendor/bin/phpcs',
				standard: 'WordPress-VIP',
				warningSeverity: 0,
				showSniffCode: true,
				colors: true
			})
		)
		// Log all problems
		.pipe( phpcs.reporter( 'log' ) )
		// Write all problems into a report file
		//.pipe( phpcs.reporter( 'file', { path: "log-phpcs-wpcs-report.txt" } ) )
		//.pipe( bsync.stream() )
		.pipe(
			notify({
				"title": "[ wplint ]",
				"message": "Lint WordPress. Task complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		)
	}
);

/**
 * Default task
 */
gulp.task(
	'default',
	gulp.series(
		'clean', // clean the build folder

		// If you have to process SVG, uncomment it from the list + inside the watcher function
		gulp.parallel( /*'svg', */'scripts', 'styles' ),

		'bsync', // load BrowserSync

		// Turn these on if you want initial linting when loading up
		// 'wplint', // lint WordPress
		// 'jslint', // lint JavaScript
		// 'sasslint', // lint Sass

		function watcher(done) {
			gulp.watch([ '**/*.php' ], gulp.parallel( 'wplint' ) );
			gulp.watch([ 'dev/js/**/*.js' ], gulp.parallel( 'scripts', 'jslint' ) );
			gulp.watch([ 'dev/scss/**/*.scss' ], gulp.parallel( 'styles', 'sasslint' ) );
			//gulp.watch([ 'dev/svg/*.svg' ], gulp.parallel( 'svg' ) );
			done();
		}
	)
);

gulp.task(
	'notify-prod', function(done) {
		return gulp.src([ '**/*.*' ])
		.pipe(
			notify({
				"title": "Production build",
				"message": "Task complete!\nAssets ready for distribution.",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch()
			})
		);
		done();
	}
);

/**
 * Build the assets for production
 */
gulp.task(
	'build-prod',
	gulp.series(
		'clean',
		//'img-opt',
		'sasslint',
		'strip',
		gulp.parallel( 'scripts', 'styles', 'svg' ),
		'sizereport',
		'notify-prod'
	)
);

gulp.task(
	'open', () => {
		return gulp.src([ '.' ])
		.pipe(
			notify({
				"title": "OPEN TASK",
				"message": "http://github.com",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch(),
				"open": "http://github.com", // URL to open on Click
				"wait": true, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds
			})
		)
	}
);
