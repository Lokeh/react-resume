const React = require('react');
const Immutable = require('immutable');
const {List, Map} = Immutable;

const inputStyle = {
	fontFamily: '"Source Code Pro", monospace',
	background: '#282828',
	border: '0',
	color: '#E6DB74',
	wordBreak: 'break-word'
}

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
			map: Map({}),
			list: List([]),
			string: ""
		};
		this.props.saveFn(this.parsePath(this.props.path+this.state.keyName+"."), types[this.state.dataType]);
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
					</select>
					{' '}<a href="#" onClick={this.setPath}><i className="fa fa-plus" style={{color: "#A6E22E"}} /></a>
					{' '}<a href="#" onClick={this.toggleOptions}><i className="fa fa-remove" style={{color: "#FD971F"}} /></a>
				</div>
			);
		}
		return (<div><a href="#"><i onClick={this.toggleOptions} className="fa fa-plus-circle" style={{marginLeft: "19px", color: "#A6E22E"}} /></a></div>);
	}
});

module.exports = AddMapEntry;
