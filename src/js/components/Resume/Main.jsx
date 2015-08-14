// Top-level component
const React = require('react');
const Immutable = require('immutable');
const {Map, List} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');

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
	componentWillMount() {
		ThemeManager.setPalette({
			accent1Color: Colors.deepOrange500
		});
	},
	getInitialState() {
		return { resume: Immutable.Map({}) };
	},
	componentWillMount() {
		getResumeJSON()
			.then((resume) => this.setState({ resume: Immutable.fromJS(resume) }))
			.catch((err) => console.error(err));
	},
	render() {
		if (this.state.resume.size === 0) return (<div></div>);
		return(<div>
			<AppBar
				title="My Resume" zDepth={0}/>
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
