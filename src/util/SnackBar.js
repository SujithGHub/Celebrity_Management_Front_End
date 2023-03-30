import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

export default function SnackBar(props) {

  const vertical = 'top'
  const horizontal = "right"

  const { event } = props;

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const getSeverity = (event) => {
    return event === 'BLOCKED' ? 'error' : "info"
  }

  const getTitle = (event) => {
    if (event === 'BLOCKED') {
      return `DATE HAS BEEN ${event}`
    } else if (event === 'COMPLETED') {
      return `EVENT HAS BEEN ${event}`
    } else {
      return `DATE HAS BEEN ${event[0]?.status}`
    }
  }

  return (
    <div>
      <Snackbar
        open={props.open}
        autoHideDuration={1000}
        onClose={props.handleSnackClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={props.handleSnackClose} severity={getSeverity(event)} sx={{ width: '100%' }}>
          {getTitle(event)}
        </Alert>
      </Snackbar>
    </div>
  );
}
