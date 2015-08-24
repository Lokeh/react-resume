// Work
const React = require('react');
const Map = require('immutable').Map;

// Material UI
const { Card, CardTitle, CardText } = require('material-ui');

const Work = React.createClass({
	render() {
		if (!this.props.info || this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Experience" />
					{this.props.info.map((work, key) => Map.isMap(work) ? (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><h2 style={{margin: "0"}}>{work.get('company')}</h2></CardTitle>
							<CardText expandable>
								<div>{work.get('position')}</div>
								<div>{work.get('startDate')} - {work.get('endDate')}</div>
							</CardText>
							<CardText expandable>
								{work.get('summary')}
							</CardText>
							{work.get('highlights') ? <CardText expandable>
								Highlights:
								<ul>
									{work.get('highlights').size ? work.get('highlights').map((highlight, key) => (<li key={key}>{highlight}</li>)) : ''}
								</ul>
							</CardText> : ''}
						</Card>) : ''
					)}
				</Card>
			</div>
		);
	}
});

module.exports = Work;
