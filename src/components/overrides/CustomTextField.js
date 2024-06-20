import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray'
    },
    '&:hover fieldset': {
      borderColor: 'gray[100]'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white'
    }
  }
});

export default CustomTextField;
