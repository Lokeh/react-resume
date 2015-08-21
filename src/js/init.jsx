// init

const React = require('react');
const injectTapEventPlugin = require("react-tap-event-plugin");
const Immutable = require('immutable');
const {List, Map} = Immutable;
injectTapEventPlugin();
React.initializeTouchEvents();

const ResumeModel = require('./models/ResumeModel');
const getResumeJSON = require('./libs/getResumeJSON');
const HistoryModel = require('./models/HistoryModel');


const Resume = require('./components/Resume');
const Editor = require('./components/Editor');

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
	render() {
		const hidden = this.state.showEditor ? 'block' : 'none';
		const width = this.state.showEditor ? "50%" : "100%";
		return (
			<div>
				<div className="editor" style={{display: hidden}}>
					<Editor
						data={this.state.resume}
						saveFn={ResumeModel.setIn.bind(ResumeModel)}
						deleteFn={ResumeModel.deleteIn.bind(ResumeModel)}
						getFn={ResumeModel.getIn.bind(ResumeModel)}
					/>
				</div>
				<div className="display" style={{float: "left", width: width}}>
					<Resume data={this.state.resume} onAppBarTouch={this.toggleEditor} />
				</div>
			</div>
		)
	}
});

window.ResumeInit = (url) => React.render(<App json={url} />, document.getElementById('app'));
