import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

  const useStyles = makeStyles(theme => ({
    textControl: {
    //margin: theme.spacing(1),
    minWidth: 350,
    },
  }));

export default function BasicTextFields() {

  const classes = useStyles();

  return (
    <TextField className={classes.textControl} id="contents" label="" />
  );
}