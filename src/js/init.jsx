// init

const React = require('react');
const getResumeJSON = require('./libs/getResumeJSON');

const Resume = React.createClass({
	getInitialState() {
		return { resume: {} };
	},
	componentWillMount() {
		getResumeJSON()
			.then((resume) => this.setState({ resume }))
			.catch((...err) => console.error(...err));
	},
	render() {
		console.log(this.state.resume);
		return(
			<h1>Hello, world!</h1>
		);
	}
});

React.render(<Resume />, document.getElementById('app'));

