// init

const React = require('react');
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
React.initializeTouchEvents();

const Resume = require('./components/Resume');
const Editor = require('./components/Editor');

const App = React.createClass({
	getInitialState() {
		return { showEditor: false }
	},
	toggleEditor() {
		this.setState({ showEditor: !this.state.showEditor });
	},
	render() {
		const hidden = this.state.showEditor ? 'block' : 'none';
		const width = this.state.showEditor ? "50%" : "100%";
		return (
			<div>
				<div className="editor" style={{display: hidden}}>
					<Editor />
				</div>
				<div style={{float: "left", width: width}}>
					<Resume onAppBarTouch={this.toggleEditor} />
				</div>
			</div>
		)
	}
});

React.render(<App />, document.getElementById('app'));

