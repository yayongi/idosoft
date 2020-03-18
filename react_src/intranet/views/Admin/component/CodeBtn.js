import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
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
  input:{
    width:'100%'
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
  grid: {
    background: 'red'
  },
  grid1: {
    background: 'yellow'
  },
  btn: {
  }
}));


export default function CodeInfo() {
  const classes = useStyles();
  

  const addBtnClick = () => {
    alert("addBtnClick");
  }
  const cancleBtnClick = () => {
    alert("cancleBtnClick");
  }


  return (
      <div className={classes.root}>
          <Grid container spacing={1}
              justify="center"
              alignItems="center">
            <Grid item xs={2} sm={1}>
              <Button className={classes.btn} 
                variant="contained" 
                color="primary"
                onClick={addBtnClick}>추가</Button>
            </Grid>
            <Grid item xs={2} sm={1}>
              <Button  className={classes.btn} 
                variant="contained" 
                color="primary"
                onClick={cancleBtnClick}>취소</Button>
            </Grid>
          </Grid>
      </div>
    );
}
