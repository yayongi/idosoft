import React, {Component, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SelectType = ({label, resKey, props, onChildClick, defaultValue, validation, disabled}) => {
  const classes = useStyles();
  const [type, setType] = React.useState('');

  const [trigger, setTrigger] = React.useState(true);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(()=>{
    if(trigger && defaultValue!==undefined && defaultValue!==null && defaultValue!==""){
      setTrigger(false);
      setType(defaultValue);
      console.log(defaultValue);
    }
  }, [defaultValue]);

  // useEffect(()=>{
  //   console.log('disabled : '+disabled);
  // }, [disabled])

  const handleChange = event => {
    setType(event.target.value);
    onChildClick({key:resKey, value:event.target.value});
  };

  return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          {label}
        </InputLabel>
        <Select
          disabled={disabled!==undefined ? disabled : false}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={handleChange}
          labelWidth={labelWidth}
          error={validation}
        > 
          {
            props.map((row, idx) => (
              <MenuItem value={row.id} key={idx}>{row.label}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
  );
}

export default SelectType;