/**
 * -----------------------------------------------------
 * Personal configuration and preferences for developers
 * -----------------------------------------------------
 */

const userNameValue    = 'BakosA'; // Your username, eg. BakosA
const projectNameValue = 'Abakos Test WP'; // Your project's name
const vhostProxyValue  = 'abakos.localhost'; // Your vhost alias for the project

// How would you like Sass and JS linter to display messages?
// Available formats are 'stylish' and 'table'
const sassLintFormat = 'stylish';
const jsLintFormat   = 'stylish';

// Gulp pop-up notifications?
let gulpNotifications = true; // 'true' or 'false'
// Play notification sounds?
const gulpSounds = true; // 'true' or 'false'

/**
 * --------------------------------------------------------
 * Files & folders -- be careful when you edit these values
 * Normally, you wouldn't want to make changes here
 * --------------------------------------------------------
 */

// Sass
const sassFiles     = 'dev/scss/**/*.s+(a|c)ss'; // Sass src files
const cssFolder     = 'build/css'; // CSS destination
const sassLintRules = '.sass-lint.yml'; // Sass lint config file

// JavaScript
const jsFiles       = 'dev/js/*.js'; // JS source files
const jsDevFolder   = 'dev/js'; // JS dev folder
const jsFolder      = 'build/scripts'; // JS destination
const jsCompiled    = 'script.min.js'; // Compiled JS file
const jsLintRules   = '.eslintrc.yml'; // JS lint config file

// SVG
const svgFiles      = 'dev/svg/*.svg'; // SVG source files
const svgFolder     = 'build/svg'; // SVG destination

// Images
const imgFiles      = 'dev/img/*'; // Image source files
const imgFolder     = 'build/images'; // Image destination

/**
 * Contents of the humansTXT file
 * http://humanstxt.org/Standard.html
 */

const
	standardsList = 'Standards: HTML5, CSS3, Sass, PHP, WordPress, JavaScript',
	componentsList = 'npm, Gulp, jQuery',
	softwareList = 'Software: Sublime Text 3, Git',
	noteText = 'Built with love by abakos',
	teamList = 'Developer: Attila Bakos\n';

/**
 * ------------------------------------------------
 * That's it.
 * Do not edit anything below this comment, please!
 * ------------------------------------------------
 */

/**
 * Gulp notifications environment variable.
 * Replace values accordingly based on user input, so
 * process.env.DISABLE_NOTIFIER can read it.
 * It can only read true or empty string for false.
 */
if (gulpNotifications === true) {
	gulpNotifications = '';
} else if (gulpNotifications === false) {
	gulpNotifications = true;
}

/**
 * Export the custom values so they can be used by
 * the tasks defined in the Gulp file.
 */
module.exports = {

	userName:        () => { return userNameValue; },
	projectName:     () => { return projectNameValue; },
	vhostProxy:      () => { return vhostProxyValue; },
	sassLintDisplay: () => { return sassLintFormat; },
	jsLintDisplay:   () => { return jsLintFormat; },
	gulpSoundSwitch: () => { return gulpSounds; },
	gulpPopUps:      () => { return gulpNotifications; },

	devSassFiles:    () => { return sassFiles; },
	buildCssFolder:  () => { return cssFolder; },
	sassLintConfig:  () => { return sassLintRules },

	devSvgFiles:     () => { return svgFiles; },
	buildSvgFolder:  () => { return svgFolder; },

	devImgFiles:     () => { return imgFiles; },
	buildImgFolder:  () => { return imgFolder; },

	devJsFiles:      () => { return jsFiles; },
	devJsFolder:     () => { return jsDevFolder; },
	buildJsFolder:   () => { return jsFolder; },
	compiledJsFile:  () => { return jsCompiled; },
	jsLintConfig:    () => { return jsLintRules; },

	humansTXT: {
		standards:		() => { return standardsList; },
		components:		() => { return componentsList; },
		software:		() => { return softwareList; },
		note:			() => { return noteText; },
		team:			() => { return teamList; }
	}
}
