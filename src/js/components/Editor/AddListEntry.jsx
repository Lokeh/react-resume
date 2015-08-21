const React = require('react');
const ResumeModel = require('../../models/ResumeModel');
const Immutable = require('immutable');
const {List, Map} = Immutable;

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
			map: Map({}),
			list: List([]),
			string: ""
		};
		// ResumeModel.push(this.parsePath(this.props.path), types[this.state.dataType]);
		const path = this.parsePath(this.props.path);
		this.props.saveFn(path, this.props.getFn(path).push(types[this.state.dataType]));
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
		return (<div><a href="#"><i onClick={this.toggleOptions} className="fa fa-plus-circle add" style={{marginLeft: "19px"}} /></a></div>);
	}
});

module.exports = AddListEntry;
