import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import moment from 'moment';
import { Autocomplete, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { set } from 'lodash';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  outline: "none",
  textAlign: "center",
  borderRadius: '15px',
};

export default function BasicModal(props) {

  const [eventToBeEdited, setEventToBeEdited] = useState(props?.eventInfo);
  const [celebrity, setCelebrity] = useState(props?.celebrity);
  const [selectedCelebrity, setSelectedCelebrity] = useState(props?.eventInfo?.celebrity);
  const [fromDateError, setFromDateError] = useState(false);
  const [toDateError, setToDateError] = useState(false);

  React.useEffect(() => {

  }, [props])

  const onChangeHandler = (event) => {
    console.log(event.target.name, event.target.value)
    setEventToBeEdited({
      ...eventToBeEdited, [event.target.name]: event.target.value
    })
  }

  const changeCelebrity = (value) => {
    setSelectedCelebrity(value);
    setEventToBeEdited({ ...eventToBeEdited, celebrity: value })
  }

  const checkDateError = (time) => {
    const time1 = new Date(time);
    const time2 = new Date(moment().format('LLL'))
    if (time1 < time2) {
      setFromDateError(true);
      return true;
    }
    setFromDateError(false)
    setToDateError(false)
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
          <span>Start Time: {moment(props.event?.start).format('LLL')}</span><br />
          <span>End Time: {moment(props.event?.end).format('LLL')}</span>
        </Typography>
        <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', margin: '1rem' }} >
          Do you want to cancel this Event?
        </Typography>
        <div className='modal-buttons'>
          <Button color='primary' style={{ marginRight: '10px' }} onClick={() => props.handleCancelEvent(props?.event?.id, 'REJECTED')} variant='contained'>Yes</Button>
          <Button color='error' variant='contained' onClick={props.handleClose}>No</Button>
        </div>
      </Box> :
        <Box sx={[style, { width: '70%', height: '90%', padding: '20px 40px 0px 40px', overflow: 'auto' }]}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '30px', marginBottom: '1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 0, fontWeight: 'bolder' }}>Event Details</h2>
            <Button onClick={props.handleClose}><CloseIcon /></Button>
          </div>
          <>
            <div className='row event-details'>
              <div className='col'>
                <TextField
                  variant='standard'
                  style={{ width: '90%' }}
                  name='name'
                  placeholder='Organizer Name'
                  helperText="Event Organizer Name"
                  value={eventToBeEdited?.name}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </div>
              <div className='col'>
                <TextField
                  variant='standard'
                  style={{ width: '90%' }}
                  name='phoneNumber'
                  placeholder='Organizer phoneNumber'
                  helperText="Event Organizer Mobile"
                  value={eventToBeEdited?.phoneNumber}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </div>
            </div>
            <div className='row event-details'>
              <div className='col'>
                <TextField
                  variant='standard'
                  name='mailId'
                  style={{ width: '90%' }}
                  placeholder='Organizer mailId'
                  helperText="Event Organizer mailId"
                  value={eventToBeEdited?.mailId}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </div>
              <div className='col'>
                <TextField
                  variant='standard'
                  name='organizationName'
                  style={{ width: '90%' }}
                  placeholder='Organization Name'
                  helperText="Event Organization Name"
                  value={eventToBeEdited?.organizationName}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </div>
            </div>
            <div className='row event-details'>
              <div className='col'>
                <TextField
                  variant='standard'
                  name='location'
                  style={{ width: '90%' }}
                  placeholder='Event Location'
                  helperText="Event Location"
                  value={eventToBeEdited?.location}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </div>
              <div className='col'>
                <TextField
                  variant='standard'
                  style={{ width: '90%' }}
                  placeholder='Event Name'
                  name='eventName'
                  value={eventToBeEdited?.eventName}
                  onChange={(event) => onChangeHandler(event)}
                  helperText="Event Name"
                  inputProps={
                    { readOnly: true }
                  }
                />
              </div>
            </div>
            <div className='row event-details'>
              <div className='col'>
              </div>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className='row event-details'>
                <div className='col'>
                  <DateTimePicker
                    name='startTime'
                    minDate={new Date()}
                    value={eventToBeEdited?.startTime}
                    onChange={(newStartTime) => onDateChange(newStartTime, 'startTime')}
                    inputFormat="DD/MM/YYYY hh:mm A"
                    renderInput={(params) => (
                      <TextField
                        variant='standard' {...params} error={checkDateError(eventToBeEdited?.startTime)} style={{ width: '90%' }} helperText="From" />
                    )}
                    PopperProps={{
                      placement: 'right-end',
                    }}
                  />
                </div>
                <div className='col'>
                  <DateTimePicker
                    name='endTime'
                    minDate={eventToBeEdited?.startTime}
                    value={eventToBeEdited?.endTime}
                    onChange={(newEndTime) => onDateChange(newEndTime, 'endTime')}
                    inputFormat="DD/MM/YYYY hh:mm A"
                    renderInput={(params) => (
                      <TextField
                        variant='standard' {...params} error={checkDateError(eventToBeEdited?.endTime, 'end')} style={{ width: '90%' }} helperText="To" />
                    )}
                    PopperProps={{
                      placement: 'right-end',
                    }}
                  />
                </div>
              </div>
            </LocalizationProvider>
            <div className='row event-details'
            // style={{display: 'flex',alignItems: 'center',margin: 'auto', width: '11rem', marginTop:'1rem'}}
            >
              <div className="col">
                <Autocomplete
                  disablePortal
                  className="my-autocomplete"
                  getOptionLabel={(option) => option.name || ""}
                  id="combo-box-demo"
                  variant="standard"
                  options={ celebrity }
                  value={selectedCelebrity || celebrity}
                  required
                  defaultValue={selectedCelebrity}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  name="celebrity"
                  placeholder='Celebrity Name'
                  onChange={(event, newValue) => changeCelebrity(newValue)}
                  renderInput={(params) => <TextField {...params} helperText="Celebrity" label="Celebrity" style={{ width: '90%', borderRadius: 0 }} />}
                />
              </div>
              <div className='col'>
              </div>
            </div>
            <Button className='primary' variant='contained' disabled={fromDateError} 
            onClick={() => props.submitHandler(eventToBeEdited, "ACCEPTED")}
            // onClick={() => submit(eventToBeEdited)}
            >Accept Enquiry</Button>
          </>
        </Box>}
    </Modal>
  );
}