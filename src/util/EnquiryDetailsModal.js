import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';
import { useState } from 'react';

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

function BasicModal(props) {

  const [eventToBeEdited, setEventToBeEdited] = useState(props?.eventInfo);
  const [celebrity,] = useState(props?.celebrity);
  const [selectedCelebrity, setSelectedCelebrity] = useState(props?.eventInfo?.celebrityIds);
  const [fromDateError, setFromDateError] = useState(false);
  const [toDateError, setToDateError] = useState(false);
  
  React.useEffect(() => {
    setEventToBeEdited(props?.eventInfo);
    setSelectedCelebrity(props?.eventInfo?.celebrityIds);
  }, [props?.eventInfo]);

  const onChangeHandler = (event) => {
    setEventToBeEdited({ ...eventToBeEdited, [event.target.name]: event.target.value, });
  }

  const changeCelebrity = (value) => {
    console.log(value, "value")
    setEventToBeEdited({ ...eventToBeEdited, celebrity: value })
    console.log(eventToBeEdited, "Updated")
  }

  const checkDateError = (date, type) => {
    const newDate = new Date(date).getTime();
    let startDate;
    let endDate;
    let oneHr = new Date(eventToBeEdited?.startTime + 60 * 60 * 1000);
    if (type === "start") {
      startDate = newDate
      oneHr = new Date(startDate + 60 * 60 * 1000);
      if (newDate < new Date().getTime()) {
        setFromDateError(true)
        return true;
      } else {
        setFromDateError(false)
        return false;
      }
    } else if (type === "end") {
      endDate = newDate
      const newStartTime = new Date(eventToBeEdited?.startTime).getTime();
      if (newDate < newStartTime) {
        setToDateError(true)
        return true;
      } else {
        setToDateError(false)
        if (endDate < oneHr) {
          setFromDateError(true)
          return true
        }
        return false;
      }
    } else {
      return false
    }
  }


  const onDateChange = (value, key) => {
    key === 'start' ? setEventToBeEdited({
      ...eventToBeEdited, startTime: new Date(value?.$d).getTime()
    }) : setEventToBeEdited({
      ...eventToBeEdited, endTime: new Date(value?.$d).getTime()
    })
  }

  const getCelebrityOptions = () => {
    const { status, celebrityIds, celebrity } = props?.eventInfo;
  
    if (status === "PENDING" || status === "REJECTED") {
      return celebrityIds;
    } else {
      return celebrity ? [celebrity] : [];
    }
  };
  

  const getCelebrityValue = () => {
    const { celebrityIds, status } = props?.eventInfo;
    if( props?.eventInfo?.celebrity){
      return props?.eventInfo?.celebrity
    }
    if (celebrityIds.length > 1) {
      if (status === "REJECTED" || status === "PENDING") {
        return eventToBeEdited?.celebrity;
      }
    } else {
      return celebrityIds[0];
    }
  };

  return (
    <Modal
    onClose={props.handleClose}
    open={props.open}
    aria-labelledby="keep-mounted-modal-title"
    aria-describedby="keep-mounted-modal-description"
    >
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
                name='venue'
                style={{ width: '90%' }}
                placeholder='Event Venue'
                helperText="Event Venue"
                value={eventToBeEdited?.venue}
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
                  onChange={(newStartTime) => onDateChange(newStartTime, 'start')}
                  inputFormat="DD/MM/YYYY hh:mm A"
                  renderInput={(params) => (
                    <TextField
                      variant='standard' {...params} error={checkDateError(eventToBeEdited?.startTime, 'start')} style={{ width: '90%' }} helperText="From" />
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
                  onChange={(newEndTime) => onDateChange(newEndTime, 'end')}
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
                options={getCelebrityOptions()}
                value={getCelebrityValue()}
                required
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                name="celebrity"
                placeholder='Celebrity Name'
                onChange={(event, newValue) => changeCelebrity(newValue)}
                renderInput={(params) => <TextField {...params} className='my-autocomplete textfield' helperText="Celebrity" label="Celebrity" style={{ width: '90%', borderRadius: 0 }} />}
              />
            </div>
            <div className='col'>
            </div>
          </div>
          <Button className='primary' style={{marginRight: '1rem'}} variant='contained' disabled={(fromDateError || toDateError || props?.eventInfo?.status === "ACCEPTED")}
            onClick={(event) => props.submitHandler(event, eventToBeEdited, "ACCEPTED")}
          >Accept</Button>
          <Button className='error' color='error' variant='contained' disabled={props?.eventInfo?.status === "REJECTED"}
            onClick={(event) => props.submitHandler(event, eventToBeEdited, "REJECTED")}
          >Reject</Button>
        </>
      </Box>
    </Modal>
  );
}

export default React.memo(BasicModal);