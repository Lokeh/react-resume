// init

const React = require('react');
const injectTapEventPlugin = require("react-tap-event-plugin");
const Immutable = require('immutable');
const {List, Map} = Immutable;
const diff = require('immutablediff');
injectTapEventPlugin();
React.initializeTouchEvents();

const ResumeModel = require('./models/ResumeModel');
const getResumeJSON = require('./libs/getResumeJSON');

const Resume = require('./components/Resume');
const Editor = require('immutable-editor');
const Toolbar = require('./components/Toolbar.jsx');

const appStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px"
}

const toolbarStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px",
	position: "absolute",
	left: "100%",
	transform: "translateX(-110px)"
}

const App = React.createClass({
	propTypes: {
		json: React.PropTypes.string.isRequired
	},
	getInitialState() {
		return {
			showEditor: false,
			resume: ResumeModel.getAll()
		};
	},
	toggleEditor() {
		this.setState({ showEditor: !this.state.showEditor });
	},
	_onChange() {
		const resume = ResumeModel.getAll();
		this.setState({ resume });
	},
	componentWillMount() {
		ResumeModel.addChangeListener(this._onChange);
		const order = ['basics', 'skills', 'work', 'education', 'volunteer', 'awards', 'publications', 'languages', 'interests', 'references']
		getResumeJSON(this.props.json)
			.then((resume) => {
				ResumeModel.new(Immutable.fromJS(resume).sortBy(
					(value, key) => key,
					(a, b) => order.indexOf(a) - order.indexOf(b)
				));
			})
			.catch((err) => console.error(err));
	},
	_onEditorUpdate(newData) {
		console.log(diff(this.state.resume, newData).toJS());
		ResumeModel.new(newData)
	},
	render() {
		const width = this.state.showEditor ? "50%" : "100%";
		return (
			<div style={appStyle}>
				{this.state.resume.size ? (<div style={{float: "left", width: this.state.showEditor ? "50%" : "0", overflow: "scroll", overflowY: "scroll", height: "100%", background: "#282828", position: "relative", transition: ".5s width" }}>
									<Toolbar
									undo={() => { this._onEditorUpdate(Editor.undo(true)) }}
									redo={() => { this._onEditorUpdate(Editor.redo(true)) }}
									save={() => { Editor.save('resume.json') }}
									/>
									<Editor
									data={this.state.resume}
									onUpdate={this._onEditorUpdate}
									minEditDepth={1}
									minRemovalDepth={2}
									immutable
									/>
				</div>) : '' }
				<div style={{float: "left", width: width, overflow: "scroll", height: "100%", transition: "width 0.5s"}}>
					<Resume data={this.state.resume} onAppBarTouch={this.toggleEditor} />
				</div>
			</div>
		)
	}
});

window.ResumeInit = (url) => React.render(<App json={url} />, document.getElementById('app'));
