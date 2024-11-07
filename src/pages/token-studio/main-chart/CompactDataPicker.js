import { DateTimePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';

const CompactDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
    '& .MuiInputBase-root': {
      // Make the input field smaller
      fontSize: '0.875rem',
      padding: '2px 4px',
      minWidth: '200px',
    },
    // Reduce the size of the calendar popup
    '& .MuiCalendarPicker-root': {
      width: '200px',
      maxHeight: '200px',
    },
    '& .MuiPickersDay-root': {
      // Make calendar days smaller
      width: '32px',
      height: '32px',
      fontSize: '0.75rem',
    },
    // Make month/year selectors smaller
    '& .MuiTypography-root': {
      fontSize: '0.875rem',
    },
    // Adjust clock size in time picker
    '& .MuiClock-clock': {
      width: '200px',
      height: '200px',
    },
  }));

  export default CompactDateTimePicker;