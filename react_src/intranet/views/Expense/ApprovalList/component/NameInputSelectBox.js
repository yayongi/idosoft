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
				value={state.name}
				onChange={handleChange('name')}
				name={'name'}
				className={classes.selectEmpty}
				inputProps={{ 'aria-label': 'name'}}
				>
				<option value="">전체</option>
				<option value={10}>강성우</option>
				<option value={20}>김준선</option>
				<option value={30}>유기환</option>
				<option value={40}>송원회</option>
			</NativeSelect>
		</FormControl>
	</div>
);
}