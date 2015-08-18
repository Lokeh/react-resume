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
	getInitialState() {
		return { resume: ResumeModel.getAll() };
	},
	_onChange() {
		this.setState({ resume: ResumeModel.getAll() });
	},
	componentWillMount() {
		ResumeModel.addChangeListener(this._onChange);
		ThemeManager.setPalette({
			primary1Color: "#2C3E50"
		});
	},
	render() {
		if (this.state.resume.size === 0) return (<div></div>);
		return(<div>
			<AppBar
				iconClassNameLeft="fa fa-pencil"
				onLeftIconButtonTouchTap={this.props.onAppBarTouch}
				title="My Resume"
				zDepth={0}
			/>
			<div style={{padding: "25px", maxWidth: "800px"}}>
				<Basics info={this.state.resume.get('basics')}/>
				<Work info={this.state.resume.get('work')} />
				<Skills info={this.state.resume.get('skills')} />
				<Volunteer info={this.state.resume.get('volunteer')} />
				<Education info={this.state.resume.get('education')} />
				<Awards info={this.state.resume.get('awards')} />
				<Publications info={this.state.resume.get('publications')} />
			</div>
		</div>);
	}
});

module.exports = Resume;
