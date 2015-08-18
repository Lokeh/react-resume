// Work
const React = require('react');

// Material UI
const mui = require('material-ui');
const Paper = mui.Paper;
const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;

const Work = React.createClass({
	render() {
		if (this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Experience" />
					{this.props.info.map((work, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><strong>{work.get('company')}</strong></CardTitle>
							<CardText expandable>
								<div>{work.get('position')}</div>
								<div>{work.get('startDate')} - {work.get('endDate')}</div>
							</CardText>
							<CardText expandable>
								{work.get('summary')}
							</CardText>
							{work.get('highlights').size ? <CardText expandable>
								Highlights:
								<ul>
									{work.get('highlights') ? work.get('highlights').map((highlight, key) => (<li key={key}>{highlight}</li>)) : ''}
								</ul>
							</CardText> : ''}
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

module.exports = Work;