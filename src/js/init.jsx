// init

const React = require('react');
const injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const Resume = require('./components/Resume');



React.render(<Resume />, document.getElementById('app'));

