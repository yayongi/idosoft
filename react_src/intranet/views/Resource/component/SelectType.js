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


export default function SelectType(props) {
  const classes = useStyles();
  const [type, setType] = React.useState('');
  const settingValue = props.selectSetting;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChange = event => {
    setType(event.target.value);
  };
  
  // const mapLander = settingValue.list.slice(1).map((row) => {
  //                         <MenuItem value={row.key}>{row.value}</MenuItem>
  //                   });

  return (
    
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          {settingValue.label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={handleChange}
          labelWidth={labelWidth}
        > 
            <MenuItem value={settingValue.list[0].key}>
                <em>{settingValue.list[0].value}</em>
            </MenuItem>
          {
           settingValue.list.map((row) => {
              {console.log(row.key+row.value)}
              (<MenuItem value={row.key}>{row.value}</MenuItem>)

            })
          }
          {/* {mapLander} */}
        </Select>
      </FormControl>
    </div>
  );
}