/**
 * Personal configuration and preferences for developers
 */

const userNameValue    = 'abakos'; // Your username, eg. BakosA
const projectNameValue = 'Abakos Test'; // Your project's name
const vhostProxyValue  = 'abakos.localhost'; // Your vhost alias for the project

// How would you like Sass and JS linter to display messages?
// Available formats: 'stylish' or 'table'
const sassLintFormat = 'stylish';
const jsLintFormat   = 'stylish';

// Play Gulp notification sounds?
const gulpSounds = true; // 'true' or 'false'

// Gulp pop-up notifications?
let gulpNotifications = true; // 'true' or 'false'

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
 * Gulp notifications.
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

	humansTXT: {
		standards:		() => { return standardsList; },
		components:		() => { return componentsList; },
		software:		() => { return softwareList; },
		note:			() => { return noteText; },
		team:			() => { return teamList; }
	}
}
