import React, {useState, useRef, useEffect, useReducer, useCallback} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: 400,
  },
  iconButton: {
    padding: 10,
  },
  btn: {
    marginLeft:'3px',
    marginRight:'0px',
    marginBottom:'10px',
    float:'right'
  },
}));


const CodeSearchDiv = (props) => {
  console.log("codeSearchDiv");
  const classes = useStyles();
  const [type, setType] = useState('', []);
  const [inputValue, setInputValue] = useState('', []);
  

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0, []);
 
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleInputChange = (event) => {
    console.log("handleInputChange");
    setInputValue(event.target.value, []);
  }


  const handleChange = (event) => {
    setType(event.target.value);

    var selectType = "";
    switch((event.target.value).trim()){
      case "코드ID":
        selectType = "code_id";
        break;
      case "코드명":
        selectType = "code_name";
        break;
      case "level":
        selectType = "code_level";
        break;
      case "상위코드":
        selectType = "upper_code";
        break;
      default:
        selectType = "";
    }
    props.selectSearchType(selectType);
  }

  const searchClick = () => {
    props.searchCode(inputValue);
  }
  

  return (
    <Toolbar className={classes.root}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                              검색조건
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={type}
            onChange={handleChange}
            labelWidth={labelWidth}
          >
            <MenuItem value={'코드ID'}>코드ID</MenuItem>
            <MenuItem value={'코드명'} >코드명</MenuItem>
            <MenuItem value={'level'}>level</MenuItem>
            <MenuItem value={'상위코드'}>상위코드</MenuItem>
          </Select>
        </FormControl>

        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="검색어를 입력하세요."
            inputProps={{ 'aria-label': '검색어를 입력하세요.' }}
            onChange={handleInputChange}
          />
          <IconButton 
            className={classes.iconButton} 
            aria-label="search"
            onClick={searchClick}>
            <SearchIcon />
          </IconButton>
        </Paper>
        <Button className={classes.btn}
          variant="contained"
          color="primary"
          component={RouterLink} to="/admin/code/addCode">
                                    코드 추가
        </Button>
    </Toolbar>
  )
}


export default CodeSearchDiv;
