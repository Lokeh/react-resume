// Toolbar
const React = require('react');
const fs = require('../../libs/FileSaver');

// Material UI
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const RaisedButton = mui.RaisedButton;

const ResumeModel = require('../../models/ResumeModel');
const HistoryModel = require('../../models/HistoryModel');

const toolbarStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px",
	position: "fixed",
	left: "50%",
	transform: "translateX(-110px)"
}

const EditorToolBar = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},
	_onChange() {
		this.setState({ size: HistoryModel.getAll().history.size })
	},
	componentWillMount() {
		HistoryModel.addChangeListener(this._onChange);
	},
	undo() {
			HistoryModel.incOffset();
			ResumeModel.new(HistoryModel.get(HistoryModel.getAll().offset));
	},
	redo() {
			HistoryModel.decOffset();
			ResumeModel.new(HistoryModel.get(HistoryModel.getAll().offset));
	},
	save() {
		const blob = new Blob([JSON.stringify(ResumeModel.getAll().toJS())], {type: "application/json;charset=utf-8"});
		fs.saveAs(blob, "resume.json");
	},
	render() {
		return (
			<div style={toolbarStyle}>
				<div style={{marginTop: "5px"}}><RaisedButton label="UNDO" primary onClick={this.undo} /></div>
				<div style={{marginTop: "5px"}}><RaisedButton label="REDO" secondary onClick={this.redo} /></div>
				<div style={{marginTop: "5px"}}><RaisedButton label="SAVE" onClick={this.save} /></div>
			</div>
		);
	}
});

module.exports = EditorToolBar;
