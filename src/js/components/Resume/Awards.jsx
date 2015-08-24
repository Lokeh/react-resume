// Awards
const React = require('react');

// Material UI
const { Card, CardTitle, CardText } = require('material-ui');

const Awards = React.createClass({
	render() {
		if (!this.props.info || this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Awards" />
					{this.props.info.map((award, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><h2 style={{margin: "0"}}>{award.get('title')}</h2></CardTitle>
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
