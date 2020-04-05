import 'date-fns';
import React from 'react';
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
  // const [selectedDate, setSelectedDate] = React.useState(new Date());
  // const [selectedDate, setSelectedDate] = React.useState(props.date===undefined?null:props.date);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [trigger, setTrigger] = React.useState(true);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    props.onChildClick({key: props.resKey, value: Moment(date).format('YYYYMM')});
  };

  React.useEffect(()=>{

    function parse(str) {
      var y = str.substr(0, 4);
      var m = str.substr(4, 2);
      var d = '01';
      return new Date(y,m-1,d);
    } 

    if(trigger && props.defaultValue!==null && props.defaultValue !== undefined && props.defaultValue !== ""){
      // debugger;
      setTrigger(false);
      setSelectedDate(parse(props.defaultValue));
    }
  }, [props.defaultValue]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          InputProps={{
                        readOnly: true,
          }}
          locale='ko' 
          margin="normal"
          id={`${props.resKey}-date-picker-dialog`}
          label={props.label}
          views={["year", "month"]}
          format="yyyy/MM" 
          maxDate={new Date()}
          value={selectedDate}
          onChange={handleDateChange}
          error={props.validation}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}