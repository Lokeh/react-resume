// Education
import React from 'react';

// Material UI
import { Card, CardTitle, CardText } from 'material-ui';

const Education = React.createClass({
	render() {
		if (!this.props.info || this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Education" />
					{this.props.info.map((education, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><h2 style={{margin: "0", fontWeight: "normal"}}>{education.get('institution')}</h2></CardTitle>
							<CardText expandable>
								<div>{education.get('area')}</div>
								<div>{education.get('startDate')} - {education.get('endDate')}</div>
							</CardText>
							{education.has('courses') ? <CardText expandable>
								Courses:
								<ul>
									{education.get('courses').size ? education.get('courses').map((course, key) => (<li key={key}>{course}</li>)) : ''}
								</ul>
							</CardText> : ''}
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

export default Education;
