import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import NoticeTop from './NoticeTop';
import ListFunctionTop from './ListFunctionTop';
import SelectType from './SelectType';
import InputSearch from './InputSearch';
import NoticeCount from './NoticeCounter';
import NoticeList from './NoticeList';
import NoticeList2 from './NoticeList2';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: "#ffffff"
  },
}));

export default function ListGridLayout() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NoticeList2/>
    </div>
  );
}
