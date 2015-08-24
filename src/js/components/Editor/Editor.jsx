// Top-level component
const React = require('react');

const HistoryModel = require('../../models/HistoryModel');

const Entry = require('./Entry.jsx');
const Toolbar = require('./Toolbar.jsx');

const editorStyle = {
	float: "left",
	width: "50%",
	minWidth: "200px",
	overflow: "scroll",
	overflowY: "scroll",
	background: "#282828",
	color: "#F8F8F2",
	fontFamily: '"Source Code Pro", monospace',
	height: "100%",
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
			<div style={editorStyle} className="editor">
				<div style={{ margin: "5px 10px" }}>
					<div id="toolbar">
						<Toolbar />
					</div>
					<Entry value={this.props.data} saveFn={this.props.saveFn} deleteFn={this.props.deleteFn} getFn={this.props.getFn} keyName="resume" path="" minEditDepth={0} minRemovalDepth={1} />
				</div>
			</div>
		);
	}
});

module.exports = Editor;
