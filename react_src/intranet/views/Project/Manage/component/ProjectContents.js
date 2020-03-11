import React from 'react';
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


export default function SelectType() {
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
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          코드 ID
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          <MenuItem value={'자원종류'}>
            <em>자원종류</em>
          </MenuItem>
          <MenuItem value={'모델명'}>모델명</MenuItem>
          <MenuItem value={'제조사'}>제조사</MenuItem>
          <MenuItem value={'제조년월'}>제조년월</MenuItem>
          <MenuItem value={'구입년월'}>구입년월</MenuItem>
          <MenuItem value={'화면크기'}>화면크기</MenuItem>
          <MenuItem value={'시리얼번호'}>시리얼번호</MenuItem>
          <MenuItem value={'시리얼번호'}>Mac주소</MenuItem>
          <MenuItem value={'보유자'}>보유자</MenuItem>
        </Select>
      </FormControl>
  );
}
