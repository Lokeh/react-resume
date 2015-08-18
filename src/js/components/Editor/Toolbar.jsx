// Toolbar
const React = require('react');

// Material UI
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, RaisedButton, FontIcon, DropDownMenu, DropDownIcon} = mui;

const ResumeModel = require('../../models/ResumeModel');
const HistoryModel = require('../../models/HistoryModel');

const EditorToolBar = React.createClass({
	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},
	undo() {

	},
	redo() {

	},
	render() {
		return (
			<div>
					<div style={{marginTop: "5px"}}><RaisedButton label="UNDO" primary onClick={this.undo} /></div>
					<div style={{marginTop: "5px"}}><RaisedButton label="REDO" secondary onClick={this.redo} /></div>
			</div>
		);
	}
});

module.exports = EditorToolBar;
