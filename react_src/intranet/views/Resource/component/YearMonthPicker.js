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
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    props.onChildClick(`${props.dataKey}_${Moment(date).format('YYYYMM')}`);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          locale='ko' 
          margin="normal"
          id="date-picker-dialog"
          label={props.label}
          views={["year", "month"]}
          format="yyyy/MM" 
          maxDate={new Date()}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}