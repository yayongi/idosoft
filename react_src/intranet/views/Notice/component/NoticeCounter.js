import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  },
}));

export default function NoticeCounter() {
  const classes = useStyles();

  return (
    <div>
      {/* <Grid container alignItems="center" className={classes.root}> */}
        {'전체건수 : 150'}
        <Divider orientation="vertical" flexItem />
        {'조회건수 : 20'}
      {/* </Grid> */}
    </div>
  );
}