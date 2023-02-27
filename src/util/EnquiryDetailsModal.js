import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import moment from 'moment';
import { TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  outline: "none",
  textAlign: "center",
  borderRadius: '15px',
};

export default function BasicModal(props) {

  const [eventToBeEdited, setEventToBeEdited] = useState({});

  React.useEffect(() => {
    setEventToBeEdited(props?.eventInfo?.row);
  }, [props?.eventInfo])

  const onChangeHandler = (event) => {
    setEventToBeEdited({
      ...eventToBeEdited, [event.target.name]: event.target.value
    })
  }

  const onDateChange = (value, key) => {
    key === 'startTime' ? setEventToBeEdited({
      ...eventToBeEdited, startTime: moment(value?.$d).format('LLL')
    }) : setEventToBeEdited({
      ...eventToBeEdited, endTime: moment(value?.$d).format('LLL')
    })
  }

  return (
    <Modal
      onClose={props.handleClose}
      open={props.open}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      {/* For calender page event accept/reject in modal */}
      {props?.event ? <Box sx={style}>
      <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold' }} >
          {/* Available Events : {props.event} */}
        </Typography>
        <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold' }} >
          {props.event?.title}
        </Typography>
        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }} >
          <h6>Start Time: {moment(props.event?.start).format('LLL')}</h6>
          <h6>End Time: {moment(props.event?.end).format('LLL')}</h6>
        </Typography>
        <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold' }} >
          Do you want to cancel this Event?
        </Typography>
        <div className='modal-buttons'>
          <Button color='primary' style={{ marginRight: '10px' }} onClick={() => props.handleCancelEvent(props?.event?.id, 'REJECTED')} variant='contained'>Yes</Button>
          <Button color='error' variant='contained' onClick={props.handleClose}>No</Button>
        </div>
      </Box> :
        <Box sx={style}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '35px', marginBottom: '1rem'}}>
          <h2 style={{ textAlign: 'center',marginBottom: 0,fontWeight: 'bolder', fontStyle:'italic' }}>Edit Schedule</h2>
          <Button onClick={props.handleClose}><CloseIcon /></Button>
          </div>
          <TextField
            style={{margin:'10px', width: '20rem'}}
            placeholder='Event Name'
            name='eventName'
            value={eventToBeEdited?.eventName}
            onChange={(event) => onChangeHandler(event)}
            helperText="Event Name"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              name='startTime'
              minDate={new Date()}
              value={eventToBeEdited?.startTime}
              onChange={(newStartTime) => onDateChange(newStartTime, 'startTime')}
              renderInput={(params) => (
                <TextField {...params} style={{width: '20rem'}} helperText="From" />
              )}
              PopperProps={{
                placement: 'right-end',
              }}
            />
            <DateTimePicker
              name='endTime'
              minDate={eventToBeEdited?.startTime}
              value={eventToBeEdited?.endTime}
              onChange={(newEndTime) => onDateChange(newEndTime, 'endTime')}
              renderInput={(params) => (
                <TextField {...params} style={{width: '20rem'}} helperText="To" />
              )}
              PopperProps={{
                placement: 'right-end',
              }}
            />
          </LocalizationProvider>
          <Button className='primary' style={{width: '100%'}} onClick={() => props.submitHandler(eventToBeEdited)}>Save Changes</Button>
        </Box>}
    </Modal>
  );
}