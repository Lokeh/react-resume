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
	getInitialState() {
		return {
			index: 1,
			size: 0
		};
	},
	_onChange() {
		this.setState({ size: HistoryModel.getAll().size })
	},
	componentWillMount() {
		HistoryModel.addChangeListener(this._onChange);
	},
	undo() {
		console.log(HistoryModel.get(this.state.size-this.state.index).toJS().basics.name);
		ResumeModel.new(HistoryModel.get(this.state.size-this.state.index-1))
		this.setState({ index: this.state.index + 1 });
	},
	redo() {
		console.log(HistoryModel.get(this.state.size-this.state.index).toJS().basics.name);
		ResumeModel.new(HistoryModel.get(this.state.size-this.state.index+1))
		this.setState({ index: this.state.index - 1 });
	},
	render() {
		const cantUndo = (this.state.size) === this.state.index;
		const cantRedo = this.state.index > this.state.size || this.state.index === 1;
		return (
			<div>
					<div style={{marginTop: "5px"}}><RaisedButton label="UNDO" primary onClick={this.undo} disabled={cantUndo} /></div>
					<div style={{marginTop: "5px"}}><RaisedButton label="REDO" secondary onClick={this.redo} disabled={cantRedo} /></div>
					<div style={{marginTop: "5px"}}>
						<RaisedButton
							label="CURRENT"
							onClick={()=> console.log(
								HistoryModel.getAll().toJS(),
								this.state,
								HistoryModel.get(this.state.size-this.state.index).toJS().basics.name
								)}
						/>
					</div>
			</div>
		);
	}
});

module.exports = EditorToolBar;
