// Publications
import React from 'react';

// Material UI
import { Card, CardTitle, CardText } from 'material-ui';

const Publications = React.createClass({
	render() {
		if (!this.props.info || this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Publications" />
					{this.props.info.map((publication, key) => (
						<Card key={key} expandable style={{width: "95%", margin: "0 auto 16px"}} initiallyExpanded={singleItem}>
							<CardTitle showExpandableButton><h2 style={{margin: "0", fontWeight: "normal"}}>{publication.get('name')}</h2></CardTitle>
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

export default Publications;
