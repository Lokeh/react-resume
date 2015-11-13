// Volunteer
import React from 'react';

// Material UI
import { Card, CardTitle, CardText } from 'material-ui';

const Volunteer = React.createClass({
	render() {
		if (!this.props.info || this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Volunteering" />
					{this.props.info.map((volunteer, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><h2 style={{margin: "0", fontWeight: "normal"}}>{volunteer.get('organization')}</h2></CardTitle>
							<CardText expandable>
								<div>{volunteer.get('position')}</div>
								<div>{volunteer.get('startDate')} - {volunteer.get('endDate')}</div>
							</CardText>
							<CardText expandable>
								{volunteer.get('summary')}
							</CardText>
							{volunteer.has('highlights') ? <CardText expandable>
								Highlights:
								<ul>
									{volunteer.get('highlights').size ? volunteer.get('highlights').map((highlight, key) => (<li key={key}>{highlight}</li>)) : ''}
								</ul>
							</CardText> : ''}
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

export default Volunteer;

