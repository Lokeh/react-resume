// Skills
import React from 'react';

// Material UI
import { Card, CardTitle, CardText, FlatButton, CardHeader, Avatar } from 'material-ui';

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

export default Skills;
