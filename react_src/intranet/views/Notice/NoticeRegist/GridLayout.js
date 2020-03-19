import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import InputFull from '../component/InputFull';
import DatePicker from '../component/DatePicker';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  buttonRoot: {
	position: 'absolute',
	top: theme.spacing(13),
	right: theme.spacing(5),
	margin: theme.spacing(1)
  },
  btn: {
	//   height: "50px"
  },
  title: {
	  align: "left"
  }
}));

export default function GridLayout() {
  const classes = useStyles();

  const [checked, setChecked] = React.useState(false);
  const handleChange = event => {
    setChecked(event.target.checked);
  };

  return (
		<div className={classes.root}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography className={classes.title} variant="h6" id="tableTitle">공지사항</Typography>
					<div className={classes.buttonRoot}>
						<Button className={classes.btn} variant="contained">
							뒤로가기
						</Button>
						<Button className={classes.btn} variant="contained" color="primary">
							저장
						</Button>
					</div>
				</Grid>
				<Grid item xs={12} sm={6}>
					<InputFull/>
				</Grid>
				<Grid item xs={6} sm={3}>
					<FormControlLabel
						control={
						<Checkbox
							onChange={handleChange}
							value=""
							color="primary"
						/>
						}
						label="중요공지 여부"
					/>
				</Grid>
				<Grid item xs={6} sm={3}>
					{
						checked===false
						?(<div></div>)
						:(<DatePicker props={checked}/>)
					}
				</Grid>

			</Grid>
		</div>
  );
}
