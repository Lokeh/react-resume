// Top-level component
const React = require('react');
const Immutable = require('immutable');
const {List, Map} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');
const ResumeModel = require('../../models/ResumeModel');
const HistoryModel = require('../../models/HistoryModel');

const Entry = require('./Entry.jsx');
const Toolbar = require('./Toolbar.jsx');

const Editor = React.createClass({
	getInitialState() {
		return {
			resume: ResumeModel.getAll()
		};
	},
	_onChange() {
		const resume = ResumeModel.getAll();
		this.setState({ resume });
		HistoryModel.push(resume);
	},
	componentWillMount() {
		ResumeModel.addChangeListener(this._onChange);
		getResumeJSON()
			.then((resume) => ResumeModel.new(Immutable.fromJS(resume)))
			.catch((err) => console.error(err));
	},
	_onClick() {
		console.log(HistoryModel.getAll().toJS());
	},
	render() {
		return (
			<div style={{margin: "5px 10px"}}>
				<div id="toolbar">
					<Toolbar />
				</div>
				<Entry value={this.state.resume} keyName="resume" path="" minEditDepth={0} minRemovalDepth={1} />
				<button onClick={this._onClick}>History</button>
			</div>
		);
	}
});

module.exports = Editor;
