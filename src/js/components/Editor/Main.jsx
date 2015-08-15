// Top-level component
const React = require('react');
const Immutable = require('immutable');
const Cursor = require('immutable/contrib/cursor');
const {List, Map} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');
const ResumeStore = require('../../stores/ResumeStore');

function buildElements(value, key, iter) {
	console.log(iter._keyPath);
	
}

const Attribute = React.createClass({
	_onChange(e) {
		const path = this.props.path.split('.')
		path.pop();
		ResumeStore.setIn(path, e.target.value);
	},
	render() {
		const value = this.props.value;
		return (
			<div style={{marginLeft: "20px"}}>
			{this.props.keyName}:{' '}
			{
				typeof value === 'string' ?
				<input value={value} onChange={this._onChange} /> :
				(<span>{'{'} {value.map((v, k) => {
					return (<Attribute key={k} value={v} keyName={k} path={this.props.path+k+'.'} />);
				}).toList()} {'}'}</span>)
			}
			</div>
		);
	}
});

const Editor = React.createClass({
	getInitialState() {
		return {
			resume: ResumeStore.getAll()
		};
	},
	_onChange() {
		this.setState({ resume: ResumeStore.getAll() });
	},
	componentWillMount() {
		ResumeStore.addChangeListener(this._onChange);
		getResumeJSON()
			.then((resume) => ResumeStore.new(Immutable.fromJS(resume)))
			.catch((err) => console.error(err));
	},
	render() {
		return (
			<div>
				{/*resume: {'{'}
				{this.state.resume.map(buildElements).toList()}
				{'}'}*/}
				<Attribute value={this.state.resume} keyName="resume" path="" />
			</div>
		);
	}
});

module.exports = Editor;
