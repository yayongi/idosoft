import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CodeBtn from './CodeBtn';

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
    width:'100%',
    height:'45px'
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

}));


export default function CodeInfo() {
  const classes = useStyles();

  return (
      <div className={classes.root}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Paper className={classes.paper}>상위코드ID</Paper>
            </Grid>
            <Grid item xs={4}>
              <input className={classes.input}/>
            </Grid>
            <Grid item xs={2}>
              <Paper className={classes.paper}>상위코드명</Paper>
            </Grid>
            <Grid item xs={4}>
              <input className={classes.input}/>
            </Grid>
            <Grid item xs={2}>
              <Paper className={classes.paper}>코드ID</Paper>
            </Grid>
            <Grid item xs={10}>
              <input className={classes.input}/>
            </Grid>
            <Grid item xs={2}>
              <Paper className={classes.paper}>코드명</Paper>
            </Grid>
            <Grid item xs={10}>
              <input className={classes.input}/>
            </Grid>
            <Grid item xs={2}>
              <Paper className={classes.paper}>코드 설명</Paper>
            </Grid>
            <Grid item xs={10}>
              <input className={classes.input}/>
            </Grid>
          </Grid>
          <CodeBtn/>
      </div>
    );
}
