// Toolbar
const React = require('react');

// Material UI
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const RaisedButton = mui.RaisedButton;

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
	render() {
		// const cantUndo = (this.state.size) === this.state.offset;
		// const cantRedo = this.state.offset > this.state.size || this.state.offset === 1;
		return (
			<div>
					<div style={{marginTop: "5px"}}><RaisedButton label="UNDO" primary onClick={this.undo} /></div>
					<div style={{marginTop: "5px"}}><RaisedButton label="REDO" secondary onClick={this.redo} /></div>
			</div>
		);
	}
});

module.exports = EditorToolBar;
