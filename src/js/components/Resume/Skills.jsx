// Skills
const React = require('react');

// Material UI
const mui = require('material-ui');
const Paper = mui.Paper;
const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;
const CardActions = mui.CardActions;
const FlatButton = mui.FlatButton;
const CardHeader = mui.CardHeader;
const Avatar = mui.Avatar;

const Skills = React.createClass({
	render() {
		if (!this.props.info || this.props.info.size === 0) return (<div></div>);
		const singleItem = this.props.info.size === 1 ? true : false;
		return (
			<div>
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="Skills" />
					<div style={{width: "95%", margin: "0 2.5%"}}>
					{this.props.info.map((skill, key) => (
						<div key={key} style={{marginBottom: "20px"}}>
							<Card initiallyExpanded>
								<CardHeader avatar={<Avatar>{skill.has('level') ? skill.get('level')[0] : ''}</Avatar>} title={skill.get('name')} subtitle={skill.get('level')} style={{fontSize: "16px"}}>
									<div style={{float: "right"}}>
										{skill.has('keywords') ? skill.get('keywords').map((word, key) => 
											(<FlatButton key={key} style={{color:"#aaa", cursor: "default"}} label={word} />)
										) : '' }
									</div>
								</CardHeader>
							</Card>
						</div>
					))}
					</div>
				</Card>
			</div>
		);
	}
});

module.exports = Skills;
