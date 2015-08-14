// Volunteer
const React = require('react');

// Material UI
const mui = require('material-ui');
const Paper = mui.Paper;
const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;

const Volunteer = React.createClass({
	render() {
		if (this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Volunteering" />
					{this.props.info.map((volunteer, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><strong>{volunteer.get('organization')}</strong></CardTitle>
							<CardText expandable>
								<div>{volunteer.get('position')}</div>
								<div>{volunteer.get('startDate')} - {volunteer.get('endDate')}</div>
							</CardText>
							<CardText expandable>
								{volunteer.get('summary')}
							</CardText>
							{volunteer.get('highlights').size ? <CardText expandable>
								Highlights:
								<ul>
									{volunteer.get('highlights') ? volunteer.get('highlights').map((highlight, key) => (<li key={key}>{highlight}</li>)) : ''}
								</ul>
							</CardText> : ''}
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

module.exports = Volunteer;

