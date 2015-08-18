// Top-level component
const React = require('react');

const HistoryModel = require('../../models/HistoryModel');

const Entry = require('./Entry.jsx');
const Toolbar = require('./Toolbar.jsx');

const Editor = React.createClass({
	componentWillReceiveProps(nextProps) {
		HistoryModel.push(nextProps.data);
	},
	render() {
		return (
			<div style={{margin: "5px 10px"}}>
				<div id="toolbar">
					<Toolbar />
				</div>
				<Entry value={this.props.data} keyName="resume" path="" minEditDepth={0} minRemovalDepth={1} />
			</div>
		);
	}
});

module.exports = Editor;
