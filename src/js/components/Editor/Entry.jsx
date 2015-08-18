const React = require('react');
const ResumeModel = require('../../models/ResumeModel');
const Immutable = require('immutable');
const {List, Map} = Immutable;

const AddMapEntry = require('./AddMapEntry.jsx');
const AddListEntry = require('./AddListEntry.jsx');

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
	shouldComponentUpdate(nextProps) {
		return this.props.value !== nextProps.value;
	},
	render() {
		const value = this.props.value;
		const isMinEditDepth = this.parsePath(this.props.path).length > this.props.minEditDepth;
		const isMinRemovalDepth = this.parsePath(this.props.path).length > this.props.minRemovalDepth;
		return (
			<div style={{marginLeft: "20px"}}>
			{this.props.keyName}:{' '}
			{
				(Map.isMap(value) ?
					(<span>{'{'} {(isMinRemovalDepth) ? <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a> : '' }
						{value.map((v, k) => {
							return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} minEditDepth={this.props.minEditDepth} minRemovalDepth={this.props.minRemovalDepth} />);
						}).toList()}
						{(isMinEditDepth) ? <AddMapEntry path={this.props.path} /> : ''}
					{'}'}</span>) :
				(List.isList(value) ?
					(<span>{'['} {(isMinRemovalDepth) ? <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a> : '' }
						{value.map((v, k) => {
							return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} minEditDepth={this.props.minEditDepth} minRemovalDepth={this.props.minRemovalDepth} />);
						}).toList()} 
						{(isMinEditDepth) ? <AddListEntry path={this.props.path} /> : ''}
					{']'}</span>) :
				(<span className="input">
					"<input type="text" value={value} onChange={this._onChange} size={value.length} />" <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a>
				</span>)))
			}
			</div>
		);
	}
});

module.exports = Entry;
