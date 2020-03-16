import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import GridLayout from './GridLayout';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { minHeight } from '@material-ui/system';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textArea: {
    width: '100%',
    minHeight: '200px'
  }
});

export default function NoticeRegistLayout() {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <GridLayout/>
      </CardContent>
      <CardActions>
        <TextareaAutosize className={classes.textArea} aria-label="content" rowsMin={3} placeholder="내용을 입력하세요." />
      </CardActions>
    </Card>
  );
}
