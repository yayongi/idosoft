import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles (theme => ({
	cardArea: {
		marginBottom: '50px'
	},
	tableHead: {
		backgroundColor: '#fbfbfb', 
		borderTop: '1px solid rgba(224, 224, 224, 1)',
	},
	tableHeadCell : {
		color: '#546e7a', 
		fontSize: '0.75rem', 
		fontWeight: 500, 
		lineHeight: '1.3125rem'
	},
	tableBodyCell : {
		color: '#546e7a', 
		fontSize: '0.75rem', 
		fontWeight: 500, 
		lineHeight: '1.3125rem'
	},
	fab: {
		position: 'absolute',
		top: theme.spacing(13),
		right: theme.spacing(5),
	},
	saveIcon: {
		marginRight: theme.spacing(1)
	},

	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	select: {
		boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
	},
}));