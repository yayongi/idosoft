import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: "100%"
  },
  textField: {
    width: "100%"
  }
}));

export default function InputFull() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        className={classes.textField}
        id="standard-full-width"
        label="Title"
        style={{ margin: 8 }}
        placeholder="제목을 입력하세요."
        helperText=""
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
}