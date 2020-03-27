import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function YearMonthPicker(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [trigger, setTrigger] = React.useState(true);
  const handleDateChange = date => {
    setSelectedDate(date);
    props.onChildChange(Moment(date).format('YYYYMMDD'));
  };

  React.useEffect(()=>{
    function parse(str) {
      var y = str.substr(0, 4);
      var m = str.substr(4, 2);
      var d = str.substr(6, 2);
      return new Date(y,m-1,d);
    } 
    if(trigger && props.defaultValue!==null && props.defaultValue !== undefined && props.defaultValue !== ""){
      // debugger;
      setTrigger(false);
      setSelectedDate(parse(props.defaultValue));
    }
  }, [props.defaultValue])

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            locale='ko' 
            margin="normal"
            id="date-picker-dialog"
            label="중요공지 기간 설정"
            minDate={new Date()}
            format="yyyy/MM/dd"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}
