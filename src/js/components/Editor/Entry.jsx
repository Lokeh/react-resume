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
		path: React.PropTypes.string.isRequired,
		minEditDepth: React.PropTypes.number,
		minRemovalDepth: React.PropTypes.number
	},
	getInitialState() {
		return {
			collapsed: false
		};
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
		ResumeModel.deleteIn(this.parsePath(this.props.path));
	},
	toggleCollapsed(e) {
		e.preventDefault();
		this.setState({ collapsed: !this.state.collapsed });
	},
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.value !== nextProps.value || this.state.collapsed !== nextState.collapsed;
	},
	render() {
		const value = this.props.value;
		const isMinRemovalDepth = this.parsePath(this.props.path).length > this.props.minRemovalDepth;
		const isMap = Map.isMap(value);
		const isList = List.isList(value)
		if (this.state.collapsed === false) {
			const isMinEditDepth = this.parsePath(this.props.path).length > this.props.minEditDepth;
			return (
				<div style={{marginLeft: "20px"}}>
				{(isMap || isList) ? <a onClick={this.toggleCollapsed}><i className="fa fa-minus-square" style={{color: "#FFD569", marginLeft: '-24px'}} /></a> : '' } {this.props.keyName}:{' '}
				{
					(isMap ?
						(<span>{'{'} {(isMinRemovalDepth) ? <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a> : '' }
							{value.map((v, k) => {
								return (<Entry key={k} value={v} keyName={k} path={this.props.path+k+'.'} minEditDepth={this.props.minEditDepth} minRemovalDepth={this.props.minRemovalDepth} />);
							}).toList()}
							{(isMinEditDepth) ? <AddMapEntry path={this.props.path} /> : ''}
						{'}'}</span>) :
					(isList ?
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
		else {
			return (
				<div style={{marginLeft: "20px"}}>
					<a onClick={this.toggleCollapsed}>
						<i className="fa fa-plus-square" style={{color: "#FFD569", marginLeft: "-24px"}} />
					</a> {this.props.keyName}
					{(isMap ? ': { ' : ': [ ')}
					{(isMinRemovalDepth) ? <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a> : '' }
					{(isMap ? ' }' : ' ]')}
				</div>
			);
		}
	}
});

module.exports = Entry;
