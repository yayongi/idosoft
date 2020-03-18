import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  }
}));

const InputSearch = ({props, onInputBlur}) => {

  const classes = useStyles();
  const [inputValue, setState] = React.useState();

  const searchClick = () => {
    if(!inputValue){
      alert("검색어를 입력해주세요");
    }
    console.log(inputValue);
  }

  const handleInputChange = (event) => {
    setState(event.target.value);
    onInputBlur(event.target.value);
  }
  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="검색어를 입력하세요."
        inputProps={{ 'aria-label': '검색어를 입력하세요.' }}
        onChange={handleInputChange}
      />
      <IconButton type="submit" className={classes.iconButton} 
        aria-label="search"
        onClick={searchClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default InputSearch;
