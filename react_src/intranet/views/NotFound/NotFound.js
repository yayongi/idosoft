import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ImgNotfound from './notfound.png';



const useStyles = makeStyles(theme => ({
	root: {
		textAlign: 'center',
	},
	media: {
		display: 'block',
		maxWidth: 620,
		margin: 'auto',
	},
	mainBtn : {
		justifyContent: 'center',
	}
}));

const NotFound = () => {
	const classes = useStyles();
	return (
	<Card className={classes.root}>
		<CardActionArea>
			<CardMedia
				component="img"
				className={classes.media}
				image={ImgNotfound}
				title="Not Found"
			/>
			<CardContent>
				<Typography gutterBottom variant="h5" component="h2">
					404 Not Found
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					존재하지 않는 페이지입니다.
				</Typography>
			</CardContent>
			<CardActions className={classes.mainBtn}>
				<Button size="small" color="primary" component={RouterLink} to="/dashboard">
				메인으로 이동
				</Button>
			</CardActions>
		</CardActionArea>
		
	</Card>
	);
};

export default NotFound;