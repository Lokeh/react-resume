// Top-level component
const React = require('react');

const HistoryModel = require('../../models/HistoryModel');

const Entry = require('./Entry.jsx');
const Toolbar = require('./Toolbar.jsx');

const editorStyle = {
	background: "#282828",
	color: "#F8F8F2",
	fontFamily: '"Source Code Pro", monospace',
	fontSize: "16px",
	WebkitFontSmoothing: "initial",
};

const Editor = React.createClass({
	propTypes: {
		saveFn: React.PropTypes.func.isRequired,
		deleteFn: React.PropTypes.func.isRequired,
		getFn: React.PropTypes.func.isRequired
	},
	componentWillReceiveProps(nextProps) {
		HistoryModel.push(nextProps.data);
	},
	shouldComponentUpdate(nextProps) {
		return this.props.data !== nextProps.data;
	},
	render() {
		return (
			<div style={editorStyle}>
				<div style={{ margin: "0px 10px" }}>
					<Toolbar />
					<Entry value={this.props.data} saveFn={this.props.saveFn} deleteFn={this.props.deleteFn} getFn={this.props.getFn} keyName="resume" path="" minEditDepth={0} minRemovalDepth={1} />
				</div>
			</div>
		);
	}
});

module.exports = Editor;
