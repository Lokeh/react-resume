// Top-level component
const React = require('react');
const Immutable = require('immutable');
const {List, Map} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');
const ResumeModel = require('../../models/ResumeModel');

const Entry = require('./Entry.jsx');

const Editor = React.createClass({
	getInitialState() {
		return {
			resume: ResumeModel.getAll()
		};
	},
	_onChange() {
		this.setState({ resume: ResumeModel.getAll() });
	},
	componentWillMount() {
		ResumeModel.addChangeListener(this._onChange);
		getResumeJSON()
			.then((resume) => ResumeModel.new(Immutable.fromJS(resume)))
			.catch((err) => console.error(err));
	},
	render() {
		return (
			<div>
				<Entry value={this.state.resume} keyName="resume" path="" minEditDepth={0} minRemovalDepth={1} />
			</div>
		);
	}
});

module.exports = Editor;
