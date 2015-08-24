const React = require('react');

// Material UI
const { Card, CardTitle, CardText, ClearFix, IconButton } = require('material-ui');

const Basics = React.createClass({
	render() {
		const basicInfo = this.props.info;
		// console.log(basicInfo('location'));
		const iconStyle = {fontSize: "20px"};
		return (
			<div>
				<div style={{float: "right"}}>
					{basicInfo.has('email') ? (<IconButton iconStyle={iconStyle} iconClassName="fa fa-envelope" tooltip={basicInfo.get('email')} tooltipPosition="top-center" />) : ''}
					{basicInfo.has('phone') ? (<IconButton iconStyle={iconStyle} iconClassName="fa fa-phone" tooltip={basicInfo.get('phone')} tooltipPosition="top-center" />) : ''}
					{basicInfo.has('website') ? (<IconButton iconStyle={iconStyle} iconClassName="fa fa-external-link" tooltip={basicInfo.get('website')} tooltipPosition="top-center" />) : ''}
					{basicInfo.has('profiles') ? basicInfo.get('profiles').map((v) => 
						v.size ? (<IconButton key={v.get('network')} iconClassName={`fa fa-${v.has('network') ? v.get('network').toLowerCase() : ''}`} tooltip={v.get('url')} tooltipPosition="top-center" />) : ''
					) : ''}
				</div>
				<h1 style={{fontSize: "3em", fontWeight: "normal"}}>{basicInfo.get('name')}<small style={{fontSize: ".5em", color: "#666", display: "block" }}>{basicInfo.get('label')}</small></h1>
				<ClearFix />
				{(() => {
					const location = basicInfo.get('location');
					return (<address style={{marginBottom: "10px", paddingLeft: "5px", textAlign: "right"}}>
							{location.get('address')}, {location.get('city')}, {location.get('postalCode')}
							</address>);
				})()}
				<Card initiallyExpanded zDepth={0}>
					<CardTitle title="About Me" />
					<CardText expandable>
						{basicInfo.get('summary')}
					</CardText>
				</Card>
			</div>
		);
	}
});

module.exports = Basics;
