// Top-level component
const React = require('react');
const Immutable = require('immutable');
const {List, Map} = Immutable;

const getResumeJSON = require('../../libs/getResumeJSON');
const ResumeModel = require('../../models/ResumeModel');

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
		ResumeModel.setIn(this.parsePath(this.props.path), e.target.value);
	},
	deletePath(e) {
		e.preventDefault();
		console.log(this.parsePath(this.props.path));
		ResumeModel.deleteIn(this.parsePath(this.props.path));
	},
	render() {
		const value = this.props.value;
		return (
			<div style={{marginLeft: "20px"}}>
			{this.props.keyName}:{' '}
			{
				(Map.isMap(value) ?
					(<span>{'{'} <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a>
						{value.map((v, k) => {
							return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} />);
						}).toList()}
						<AddMapEntry path={this.props.path} />
					{'}'}</span>) :
				(List.isList(value) ?
					(<span>{'['} <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a>
						{value.map((v, k) => {
							return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} />);
						}).toList()} 
						<AddListEntry path={this.props.path} />
					{']'}</span>) :
				(<span className="input">
					"<input type="text" value={value} onChange={this._onChange} size={value.length} />" <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a>
				</span>)))
			}
			</div>
		);
	}
});

const AddMapEntry = React.createClass({
	getInitialState() {
		return {
			showOptions: false,
			keyName: "",
			dataType: "string"
		};
	},
	parsePath(path) {
		const _path = path.split('.')
		_path.pop();
		return _path;
	},
	setPath(e) {
		e.preventDefault();
		const types = {
			map: Immutable.Map({}),
			list: Immutable.List([]),
			string: ""
		};
		// ResumeModel.push(this.parsePath(this.props.path), types[this.state.dataType]);
		console.log(this.state);
		ResumeModel.setIn(this.parsePath(this.props.path+this.state.keyName+"."), types[this.state.dataType]);
		this.toggleOptions();
	},
	toggleOptions() {
		this.setState({ showOptions: !this.state.showOptions });
	},
	setType(e) {
		const dataType = e.target.value;
		this.setState({ dataType });
	},
	setKey(e) {
		const keyName = e.target.value;
		this.setState({ keyName });
	},
	render() {
		if (this.state.showOptions) {
			return (
				<div style={{marginLeft: "20px"}}>
					<label htmlFor="key">key:</label> <input name="key" type="text" onChange={this.setKey} /><br />
					<label htmlFor="type">type:</label> <select name="type" onChange={this.setType}>
						<option value="string">String</option>
						<option value="map">Map</option>
						<option value="list">List</option>
					</select> <a href="#" onClick={this.setPath}><i className="fa fa-plus-circle add" /></a>
				</div>
			);
		}
		return (<div><a href="#"><i onClick={this.toggleOptions} className="fa fa-plus-circle add" /></a></div>);
	}
});

const AddListEntry = React.createClass({
	getInitialState() {
		return {
			showOptions: false,
			dataType: "string"
		};
	},
	parsePath(path) {
		const _path = path.split('.')
		_path.pop();
		return _path;
	},
	pushPath(e) {
		e.preventDefault();
		const types = {
			map: Immutable.Map({}),
			list: Immutable.List([]),
			string: ""
		};
		ResumeModel.push(this.parsePath(this.props.path), types[this.state.dataType]);
		this.toggleOptions();
	},
	toggleOptions() {
		this.setState({ showOptions: !this.state.showOptions });
	},
	setType(e) {
		const dataType = e.target.value;
		this.setState({ dataType });
	},
	render() {
		if (this.state.showOptions) {
			return (
				<div style={{marginLeft: "20px"}}>
					<label htmlFor="type">type:</label> <select name="type" onChange={this.setType}>
						<option value="string">String</option>
						<option value="map">Map</option>
						<option value="list">List</option>
					</select> <a href="#" onClick={this.pushPath}><i className="fa fa-plus-circle add" /></a>
				</div>
			);
		}
		return (<div><a href="#"><i onClick={this.toggleOptions} className="fa fa-plus-circle add" /></a></div>);
	}
});

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
				<Entry value={this.state.resume} keyName="resume" path="" />
			</div>
		);
	}
});

module.exports = Editor;
