// Toolbar
const React = require('react');

// Material UI
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const RaisedButton = mui.RaisedButton;

const toolbarStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px",
	position: "fixed",
	left: "50%",
	transform: "translateX(-105%)"
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
	undo() {
		this.props.undo()
	},
	redo() {
		this.props.redo()
	},
	save() {
		this.props.save()
	},
	render() {
		return (
			<div style={toolbarStyle}>
				<div style={{marginTop: "5px"}}>
					<RaisedButton label="UNDO" primary onClick={this.undo} />
				{' '}<RaisedButton label="REDO" secondary onClick={this.redo} />
				{' '}<RaisedButton label="SAVE" onClick={this.save} />
				</div>
			</div>
		);
	}
});

module.exports = EditorToolBar;
