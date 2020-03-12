import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function SelectYm2() {
  const classes = useStyles();
  const [type, setType] = React.useState('');

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChange = event => {
    setType(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          월 선택
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          <MenuItem value={new Date().getMonth()+1}>
            <em>{new Date().getMonth()+1}</em>
          </MenuItem>
          <MenuItem value={'01'}>01</MenuItem>
          <MenuItem value={'02'}>02</MenuItem>
          <MenuItem value={'04'}>03</MenuItem>
          <MenuItem value={'05'}>04</MenuItem>
          <MenuItem value={'06'}>05</MenuItem>
          <MenuItem value={'07'}>06</MenuItem>
          <MenuItem value={'08'}>07</MenuItem>
          <MenuItem value={'09'}>08</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}