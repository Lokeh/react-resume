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
					<CardTitle title="Skills" />
					<div style={{float: "left", width: "95%", margin: "0 2.5%"}}>
					{this.props.info.map((publication, key) => (
						<div key={key} className="skill">
							<Card initiallyExpanded>
								<CardTitle><strong>{publication.get('name')}</strong></CardTitle>
								<CardText expandable>
									<div>Level: {publication.get('level')}</div>
									{publication.get('keywords') ? (<div style={{marginTop: "15px"}}>
										{publication.get('keywords').map((word, key) => 
											(<span key={key} style={{color:"#aaa"}}>{word} </span>)
										)}
									</div>) : '' }
								</CardText>
							</Card>
						</div>
					))}
					</div>
				</Card>
			</div>
		);
	}
});

module.exports = Publications;
