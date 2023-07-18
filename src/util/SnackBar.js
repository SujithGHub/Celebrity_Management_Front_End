import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

export default function SnackBar(props) {

  const vertical = 'top'
  const horizontal = "center"

  let { event } = props

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const getSeverity = (event) => {
    let { status } = event;
    return status === 'BLOCKED' ? 'error' : status === 'REJECTED' ? 'error' : "info"
  }

  const getTitle = (event) => {
    let { status } = event;
    return status === 'BLOCKED' ? `DATE HAS BEEN ${status}` : status === 'REJECTED' ? `THIS EVENT IS CANCELLED` : status === 'COMPLETED' ? `THIS EVENT IS ${status}` : ` EVENT IS AVAILABLE CAN'T BLOCK DATE`
  }

  return (
    <div>
      <Snackbar
        open={props.open}
        autoHideDuration={1000}
        onClose={props.handleSnackClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={props?.handleSnackClose} severity={getSeverity(event.extendedProps ? event.extendedProps : event[0])} sx={{ width: '100%' }}>
          {getTitle(event.extendedProps ? event.extendedProps : event[0])}
        </Alert>
      </Snackbar>
    </div>
  );
}
