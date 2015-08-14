const React = require('react');

// Material UI
const mui = require('material-ui');
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;

const Card = mui.Card;
const CardTitle = mui.CardTitle;
const CardText = mui.CardText;
const ClearFix = mui.ClearFix;


const Basics = React.createClass({
	render() {
		const basicInfo = this.props.info;
		// console.log(basicInfo('location'));
		const iconStyle = {fontSize: "20px"};
		return (
			<div>
				<div style={{float: "right"}}>
					<mui.IconButton iconStyle={iconStyle} iconClassName="fa fa-envelope" tooltip={basicInfo.get('email')} tooltipPosition="top-center" />
					<mui.IconButton iconStyle={iconStyle} iconClassName="fa fa-phone" tooltip={basicInfo.get('phone')} tooltipPosition="top-center" />
					<mui.IconButton iconStyle={iconStyle} iconClassName="fa fa-external-link" tooltip={basicInfo.get('website')} tooltipPosition="top-center" />
					{basicInfo.get('profiles').map((v) => 
						(<mui.IconButton key={v.get('network')} iconClassName={`fa fa-${v.get('network').toLowerCase()}`} tooltip={v.get('network')} tooltipPosition="top-center" />)
					)}
				</div>
				<h1>{basicInfo.get('name')}<small>{basicInfo.get('label')}</small></h1>
				<ClearFix />
				{(() => {
					const location = basicInfo.get('location');
					return (<address style={{marginBottom: "10px", paddingLeft: "5px", textAlign: "right"}}>
							{location.get('address')}, {location.get('city')}, {location.get('postalCode')}
							</address>);
				})()}
				{/*<h2>About Me</h2>-->*/}
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
