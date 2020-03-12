import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
					<option value="">등록자순</option>
					<option value={10}>등록일순</option>
				</NativeSelect>
				<FormControlLabel
					value="end"
					control={<Checkbox color="primary" />}
					label="내림차순"
					labelPlacement="end"
				/>
			</FormControl>
		</div>
	);
}