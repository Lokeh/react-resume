// Publications
const React = require('react');

// Material UI
const mui = require('material-ui');
const Paper = mui.Paper;
const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;

const Publications = React.createClass({
	render() {
		if (this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Publications" />
					{this.props.info.map((publication, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><strong>{publication.get('name')}</strong></CardTitle>
							<CardText expandable>
								<div>{publication.get('publisher')}</div>
								<div>{publication.get('releaseDate')}</div>
								<div>{publication.get('website')}</div>
								<div>{publication.get('summary')}</div>
							</CardText>
						</Card>
					))}
				</Card>
			</div>
		);
	}
});

module.exports = Publications;
