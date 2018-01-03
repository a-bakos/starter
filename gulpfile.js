'use strict';

/**
 * abakos - Gulp Setup
 *
 * To list all the available tasks, type:
 * gulp --tasks
 */

// Load user/developer configuration file:
const userConfig = require( './userConfig' );
// Gulp notifier environment variable:
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
const imagemin = require( 'gulp-imagemin' );
const eslint = require( 'gulp-eslint' );
const autoprefixer = require( 'gulp-autoprefixer' );
const sassLint = require( 'gulp-sass-lint' );
const phpcs = require( 'gulp-phpcs' );
const babel = require( 'gulp-babel' );

// Node packages
const del = require( 'del' );
const bsync = require( 'browser-sync' );

/**
 * Runs the SVG spriting process,
 * combines all SVGs into one SVG sprite
 */
gulp.task(
	'svg', () => {
		return gulp.src( [ userConfig.devSvgFiles() ] )
		.pipe( svgStore( { inlineSvg: true } ) )
		.pipe(
			svgmin({
				plugins:
				[{
					cleanupIDs: false
				}]
			})
		)
		.pipe( gulp.dest( userConfig.buildSvgFolder() ) );
	}
);

/**
 * Compress images
 */
gulp.task(
	'img-opt', () => {
		return gulp.src([ userConfig.devImgFiles() ])
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
		.pipe( gulp.dest( userConfig.buildImgFolder() ) )
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
		return gulp.src([ userConfig.devJsFiles() ])
		.pipe( stripDebug() )
		.pipe( gulp.dest( userConfig.devJsFolder() ) )
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
gulp.task(
	'scripts', () => {
		return gulp.src([ userConfig.devJsFiles() ])
		.pipe( sourcemaps.init() )
		.pipe( concat( userConfig.compiledJsFile() ) ) // Concatenate all JS files
		.pipe( babel( { presets: ['env'] } ) ) // Transpile to pre ES6 version
		.pipe( uglify() ) // Minify the JS script
		.pipe( sourcemaps.write( '.' ) ) // Attach sourcemaps
		.pipe( gulp.dest( userConfig.buildJsFolder() ) )
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
gulp.task(
	'jslint', () => {
		return gulp.src([ userConfig.devJsFiles() ])
		.pipe( eslint( { "configFile": userConfig.jsLintConfig() } ) )
		.pipe( eslint.format( userConfig.jsLintDisplay() ) )
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
/**
 * Lint the custom JavaScript files for production
 * Rules are in package.json @ eslintConfig
 * http://eslint.org/
  */
gulp.task(
	'jslint:prod', (done) => {
		return gulp.src([ userConfig.devJsFiles() ])
		.pipe( eslint( { "configFile": userConfig.jsLintConfig() } ) )
		.pipe( eslint.format( userConfig.jsLintDisplay() ) )
		.pipe( eslint.failAfterError() )
		.on("error", () => {
			console.log( 'JavaScript lint failed!\n' );
			done();
		})
	}
);


/**
 * Compile and compress SCSS files into CSS,
 * prefix the code when needed,
 * and attach sourcemap
 */
gulp.task(
	'styles', () => {
		return gulp.src([ userConfig.devSassFiles() ])
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
		.pipe( gulp.dest( userConfig.buildCssFolder() ) ) // Place the processed stylesheet in here
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
 * Lint SASS for development
 */
gulp.task(
	'sasslint', () => {
		return gulp.src([ userConfig.devSassFiles() ])
		.pipe(
			sassLint({
				options: {
					"formatter": userConfig.sassLintDisplay(),
					"cache-config": true
				},
				configFile: userConfig.sassLintConfig()
			})
		)
		.pipe( sassLint.format() )
		.pipe(
			notify({
				"title": "[ sasslint ]",
				"message": "Sass lint task complete!",
				"onLast": true,
				"sound": userConfig.gulpSoundSwitch(),
			})
		)
	}
);

/**
 * Lint SASS for production
 * The task will fail on error!
 */
gulp.task(
	'sasslint:prod', () => {
		return gulp.src([ userConfig.devSassFiles() ])
		.pipe(
			sassLint({
				options: {
					formatter: userConfig.sassLintDisplay(),
					"cache-config": true
				},
				configFile: userConfig.sassLintConfig()
			})
		)
		.pipe( sassLint.format() )
		.pipe( sassLint.failOnError() )
		.on("error", () => {
			console.log( 'Sass lint failed!\n' );
		})
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
 * Size report - display the file sizes inside the build folder
 */
gulp.task(
	'sizereport', () => {
		return gulp.src([
			'build/**/*',
			'!build/**/*.map' // Don't include sourcemaps
		])
		.pipe( sizereport( { gzip: true } ) )
	}
);

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
 * WordPress Lint for development
 * Lints .php files against WordPress VIP Coding Standards
 *
 * Notes:
 * - https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards
 * - https://github.com/squizlabs/PHP_CodeSniffer
 * - composer!
 */
gulp.task(
	'wplint', () => {
		return gulp.src([
			'./**/*.php',
			// Add exceptions here:
			'!node_modules/**/*.php'
		])
		.pipe(
			phpcs({
				bin: 'c:/users/' + userConfig.userName() + '/appdata/roaming/composer/vendor/bin/phpcs',
				standard: 'WordPress-VIP',
				warningSeverity: 0,
				showSniffCode: true,
				colors: true
			})
		)
		.pipe( phpcs.reporter( 'log' ) ) // Log all problems
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

// gulp.task('phpcbf', shell.task(['vendor/bin/phpcbf --standard=PSR2 --ignore=vendor/,some/other/folder folder/to/include another/folder/to/include somefiletoinclude.php server.php']));

/**
 * WordPress Lint for production
 * The task will fail on error!
 */
gulp.task(
	'wplint:prod', (done) => {
		return gulp.src([
			'./**/*.php',
			// Add exceptions here:
			'!node_modules/**/*.php'
		])
		.pipe(
			phpcs({
				bin: 'c:/users/' + userConfig.userName() + '/appdata/roaming/composer/vendor/bin/phpcs',
				standard: 'WordPress-VIP',
				severity: 1,
				warningSeverity: 1,
				errorSeverity: 2,
				showSniffCode: true,
				colors: true
			})
		)
		.pipe( phpcs.reporter( 'log' ) ) // Log all problems
		.pipe( phpcs.reporter( 'fail' ) )
		.on("error", function() {
			console.log( 'WordPress lint failed!\n' );
			done();
		})
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
			gulp.watch([ 'dev/scss/**/*.s+(a|c)ss' ], gulp.parallel( 'styles', 'sasslint' ) );
			//gulp.watch([ 'dev/svg/*.svg' ], gulp.parallel( 'svg' ) );
			done();
		}
	)
);

/**
 * Default task with no browser sync server
 */
gulp.task(
	'no-bs',
	gulp.series(
		'clean', // clean the build folder

		// If you have to process SVG, uncomment it from the list + inside the watcher function
		gulp.parallel( /*'svg', */'scripts', 'styles' ),

		function watcher(done) {
			gulp.watch([ '**/*.php' ], gulp.parallel( 'wplint' ) );
			gulp.watch([ 'dev/js/**/*.js' ], gulp.parallel( 'scripts', 'jslint' ) );
			gulp.watch([ 'dev/scss/**/*.s+(a|c)ss' ], gulp.parallel( 'styles', 'sasslint' ) );
			//gulp.watch([ 'dev/svg/*.svg' ], gulp.parallel( 'svg' ) );
			done();
		}
	)
);

/**
 * Rebuild task
 */
gulp.task(
	'rebuild',
	gulp.series(
		'clean', // clean the build folder

		// Turn these on if you want linting
		// 'wplint', // lint WordPress
		// 'jslint', // lint JavaScript
		// 'sasslint', // lint Sass

		// If you have to process SVG, uncomment it from the list + inside the watcher function
		gulp.parallel( 'img-opt', /*'svg', */'scripts', 'styles' ),

		'sizereport'
	)
);

/**
 * Production / distribution tasks
 * Build the assets for production
 */
gulp.task(
	'notify-prod', function(done) {
		return gulp.src([ 'build/**/*' ])
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

gulp.task(
	'prod',
	gulp.series(
		gulp.parallel('clean', 'strip'),

		'sasslint:prod', // lint Sass
		'wplint:prod',   // lint WordPress
		'jslint:prod',   // lint JavaScript

		//gulp.parallel( 'img-opt', 'scripts', 'styles', 'svg' ),
		gulp.parallel( 'sizereport', 'notify-prod' )
	)
);
