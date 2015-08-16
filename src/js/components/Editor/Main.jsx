// Top-level component
const React = require('react');
const Immutable = require('immutable');
const {List, Map} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');
const ResumeStore = require('../../stores/ResumeStore');

const Entry = React.createClass({
	propTypes: {
		keyName: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]).isRequired,
		value: React.PropTypes.oneOfType([
			React.PropTypes.instanceOf(List),
			React.PropTypes.instanceOf(Map),
			React.PropTypes.string
		]).isRequired,
		path: React.PropTypes.string.isRequired
	},
	parsePath(path) {
		const _path = path.split('.')
		_path.pop();
		return _path;
	},
	_onChange(e) {
		ResumeStore.setIn(this.parsePath(this.props.path), e.target.value);
	},
	deletePath(e) {
		e.preventDefault();
		console.log(this.parsePath(this.props.path));
		ResumeStore.deleteIn(this.parsePath(this.props.path));
	},
	render() {
		const value = this.props.value;
		return (
			<div style={{marginLeft: "20px"}}>
			{this.props.keyName}:{' '}
			{
				(Map.isMap(value) ?
					(<span>{'{'} {value.map((v, k) => {
						return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} />);
					}).toList()} {'}'}</span>) :
				(List.isList(value) ?
					(<span>{'['} {value.map((v, k) => {
						return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} />);
					}).toList()} {']'}</span>) :
				<input value={value} onChange={this._onChange} />))
			}
			<a href="#" onClick={this.deletePath}>( - )</a>
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
				<Entry value={this.state.resume} keyName="resume" path="" />
			</div>
		);
	}
});

module.exports = Editor;
