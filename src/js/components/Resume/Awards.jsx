// Awards
const React = require('react');

// Material UI
const mui = require('material-ui');
const Paper = mui.Paper;
const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;

const Awards = React.createClass({
	render() {
		if (this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Awards" />
					{this.props.info.map((award, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><strong>{award.get('title')}</strong></CardTitle>
							<CardText expandable>
								<div>{award.get('awarder')}</div>
								<div>{award.get('date')}</div>
								<div>{award.get('summary')}</div>
							</CardText>
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

module.exports = Awards;
