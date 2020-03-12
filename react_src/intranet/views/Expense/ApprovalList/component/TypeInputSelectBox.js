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
				value={state.type}
				onChange={handleChange('type')}
				name={'type'}
				className={classes.selectEmpty}
				inputProps={{ 'aria-label': 'type'}}
				>
				<option value="">None</option>
				<option value={10}>Ten</option>
				<option value={20}>Twenty</option>
				<option value={30}>Thirty</option>
			</NativeSelect>
		</FormControl>
	</div>
);
}