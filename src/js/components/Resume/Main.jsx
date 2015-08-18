// Top-level component
const React = require('react');
const Immutable = require('immutable');
const {Map, List} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');
const ResumeModel = require('../../models/ResumeModel');
React.initializeTouchEvents(true);


// Material UI
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const AppBar = mui.AppBar;
const Snackbar = mui.Snackbar;

// components
const Basics = require('./Basics.jsx');
const Work = require('./Work.jsx');
const Volunteer = require('./Volunteer.jsx');
const Education = require('./Education.jsx');
const Awards = require('./Awards.jsx');
const Publications = require('./Publications.jsx');
const Skills = require('./Skills.jsx');

const Resume = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},
	componentWillMount() {
		ThemeManager.setPalette({
			primary1Color: "#2C3E50"
		});
	},
	render() {
		if (this.props.data.size === 0) return (<div></div>);
		return(<div>
			<AppBar
				iconClassNameLeft="fa fa-pencil"
				onLeftIconButtonTouchTap={this.props.onAppBarTouch}
				title="My Resume"
				zDepth={1}
				style={{position: "fixed"}}
			/>
			<div style={{padding: "64px 25px 25px", maxWidth: "800px"}}>
				<Basics info={this.props.data.get('basics')}/>
				<Work info={this.props.data.get('work')} />
				<Skills info={this.props.data.get('skills')} />
				<Volunteer info={this.props.data.get('volunteer')} />
				<Education info={this.props.data.get('education')} />
				<Awards info={this.props.data.get('awards')} />
				<Publications info={this.props.data.get('publications')} />
			</div>
			<Snackbar
				message="Click on the pencil icon in the upper-right corner to edit"
				openOnMount
			/>
		</div>);
	}
});

module.exports = Resume;
