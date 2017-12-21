/**
 * Personal configuration for developers
 */

// Your username, eg. BakosA:
const userNameValue = 'abakos';

// Your project's name
const projectNameValue = 'Abakos Test WP';

// Your vhost alias for the project:
const vhostProxyValue = 'abakos.localhost';

// How would you like Sass linter to display messages?
// Available formats: 'stylish' or 'table'
const sassLintFormat = 'stylish';

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
 * Export the custom values so they can be used by
 * the tasks defined in the Gulp file.
 */

module.exports = {

	userName:			() => { return userNameValue; },
	projectName:		() => { return projectNameValue; },
	vhostProxy:			() => { return vhostProxyValue; },
	sassLintDisplay:	() => { return sassLintFormat; },

	humansTXT: {
		standards:		() => { return standardsList; },
		components:		() => { return componentsList; },
		software:		() => { return softwareList; },
		thanks:			() => { return thanksText; },
		note:			() => { return noteText; },
		team:			() => { return teamList; }
	}
}
