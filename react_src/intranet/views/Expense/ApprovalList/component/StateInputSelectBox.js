import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles(theme => ({
formControl: {
	margin: theme.spacing(1),
	minWidth: 150,
},
selectEmpty: {
	//marginTop: theme.spacing(1),
},
}));

export default function NativeSelects() {
const classes = useStyles();
const [state, setState] = React.useState({
	age: '',
	name: 'hai',
});

const handleChange = name => event => {
	setState({
	...state,
	[name]: event.target.value,
	});
};

return (
	<div>
		<FormControl className={classes.formControl}>
			<NativeSelect
				value={state.state}
				onChange={handleChange('state')}
				name={'state'}
				className={classes.selectEmpty}
				inputProps={{ 'aria-label': 'state'}}
				>
				<option value="">진행</option>
				<option value={10}>1차결재</option>
				<option value={20}>완료</option>
				<option value={30}>반려</option>
			</NativeSelect>
		</FormControl>
	</div>
);
}