import { withStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
	root: {
	flexGrow: 1,
	},
	paper: {
	padding: theme.spacing(2),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	},
	paperContents: {
	padding: theme.spacing(1),
	},
	center: {
	textAlign: 'center',
	},
	left: {
	textAlign: 'left',
	},
	right: {
	textAlign: 'right',
	},
}));