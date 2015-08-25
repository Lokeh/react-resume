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
		name: React.PropTypes.string
	},
	componentDidMount() {
		HistoryModel.push(this.props.data);
	},
	componentWillReceiveProps(nextProps) {
		HistoryModel.push(nextProps.data);
	},
	shouldComponentUpdate(nextProps) {
		return this.props.data !== nextProps.data;
	},
	render() {
		console.log(this.props.cursor.size);
		return (
			<div style={editorStyle}>
				<div style={{ margin: "0px 10px" }}>
					<Toolbar />
					<Entry cursor={this.props.cursor} value={this.props.data} keyName={this.props.name} path="" minEditDepth={0} minRemovalDepth={1} />
				</div>
			</div>
		);
	}
});

window.HistoryModel = HistoryModel;

module.exports = Editor;
