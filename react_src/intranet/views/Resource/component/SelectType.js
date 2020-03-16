import React, {Component,} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SelectType = ({props, onChildClick}) => {

  const classes = useStyles();
  const [type, setType] = React.useState('');

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChange = event => {
	  setType(event.target.value);
    onChildClick(event.target.value);
  };


  return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          // onChange={handleChange, handleClick}
          onChange={handleChange}
          labelWidth={labelWidth}
        > 
          {/* {
            props.list.map((row, idx) => {
              return (<MenuItem value={`${props.dataKey}_${row.key}`} key={idx}>{row.value}</MenuItem>)
            })
          } */}
          {
            props.list.map((row, idx) => (
              <MenuItem value={`${props.dataKey}_${row.key}`} key={idx}>{row.value}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
  );
}

export default SelectType;