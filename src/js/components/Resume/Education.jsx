// Education
const React = require('react');

// Material UI
const mui = require('material-ui');
const Paper = mui.Paper;
const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;

const Education = React.createClass({
	render() {
		if (this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Education" />
					{this.props.info.map((education, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><strong>{education.get('institution')}</strong></CardTitle>
							<CardText expandable>
								<div>{education.get('area')}</div>
								<div>{education.get('startDate')} - {education.get('endDate')}</div>
							</CardText>
							{education.get('courses').size ? <CardText expandable>
								Courses:
								<ul>
									{education.get('courses') ? education.get('courses').map((course, key) => (<li key={key}>{course}</li>)) : ''}
								</ul>
							</CardText> : ''}
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

module.exports = Education;
