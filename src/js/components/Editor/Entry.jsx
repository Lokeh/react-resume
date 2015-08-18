const React = require('react');
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
		minRemovalDepth: React.PropTypes.number,
		saveFn: React.PropTypes.func.isRequired,
		deleteFn: React.PropTypes.func.isRequired
	},
	getInitialState() {
		return {
			collapsed: false,
			inputValue: ""
		};
	},
	parsePath(path) {
		const _path = path.split('.')
		_path.pop();
		return _path;
	},
	_onChange(e) {
		this.setState({ inputValue: e.target.value });
	},
	_onBlur(e) {
		// update the model on blur
		// ResumeModel.setIn(this.parsePath(this.props.path), this.state.inputValue);
		this.props.saveFn(this.parsePath(this.props.path), this.state.inputValue);
	},
	_onKeyUp(e) {
		// update the model on enter
		if (e.key === "Enter") {
			// ResumeModel.setIn(this.parsePath(this.props.path), this.state.inputValue);
			this.props.saveFn(this.parsePath(this.props.path), this.state.inputValue);
		}
	},
	deletePath(e) {
		e.preventDefault();
		// ResumeModel.deleteIn(this.parsePath(this.props.path));
		this.props.deleteFn(this.parsePath(this.props.path));
	},
	toggleCollapsed(e) {
		e.preventDefault();
		this.setState({ collapsed: !this.state.collapsed });
	},
	componentWillMount() {
		this.setState({ inputValue: this.props.value });
	},
	componentWillReceiveProps(nextProps) {
		this.setState({ inputValue: nextProps.value });
	},
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.value !== nextProps.value || this.state.collapsed !== nextState.collapsed || this.state.inputValue !== nextState.inputValue
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
								return (<Entry saveFn={this.props.saveFn} deleteFn={this.props.deleteFn} key={k} value={v} keyName={k} path={this.props.path+k+'.'} minEditDepth={this.props.minEditDepth} minRemovalDepth={this.props.minRemovalDepth} />);
							}).toList()}
							{(isMinEditDepth) ? <AddMapEntry path={this.props.path} /> : ''}
						{'}'}</span>) :
					(isList ?
						(<span>{'['} {(isMinRemovalDepth) ? <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a> : '' }
							{value.map((v, k) => {
								return (<Entry saveFn={this.props.saveFn} deleteFn={this.props.deleteFn} key={k} value={v} keyName={k} path={this.props.path+k+'.'} minEditDepth={this.props.minEditDepth} minRemovalDepth={this.props.minRemovalDepth} />);
							}).toList()} 
							{(isMinEditDepth) ? <AddListEntry path={this.props.path} /> : ''}
						{']'}</span>) :
					(<span className="input">
						"<input
							type="text"
							value={this.state.inputValue}
							onChange={this._onChange}
							onBlur={this._onBlur}
							onKeyUp={this._onKeyUp}
							size={this.state.inputValue.length}
						/>" <a href="#" onClick={this.deletePath}><i className="fa fa-times-circle" /></a>
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
