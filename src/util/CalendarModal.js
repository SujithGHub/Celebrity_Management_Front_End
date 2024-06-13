import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { isEmpty } from 'lodash';
import moment from 'moment';
import * as React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: 24,
  // p: 3,
  pt: 2,
  px: 4,
  pb: 3,
  outline: "none",
};

function ChildModal(props) {

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button className='primary' variant='contained' color='error' onClick={handleOpen} style={{ marginRight: '1rem', width: '20%' }}>Yes</Button>
        <Button variant='contained' onClick={props.handleClose} style={{ width: '20%' }}>No</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={[style, { textAlign: 'center', width: 500 }]}>
          <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }} >
            {(props.event?.title).toUpperCase()}
          </Typography>

          <Typography id="keep-mounted-modal-title" variant="h5" component="h3" style={{ margin: '1rem' }} >
            Are you sure to cancel this Event???
          </Typography>
          <div className='modal-button'>
            <Button color='error' style={{ marginRight: '10px' }} onClick={() => props.handleCancelEvent(props?.event?.id)} variant='contained'>Yes</Button>
            <Button variant='contained' onClick={props.handleClose}>No</Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export function CalendarModal(props) {

  // Memoize the formatted event data
  const formattedEventData = React.useMemo(() => {
    if (!props.event) return null;

    return {
      startTime: moment(props.event.start).format('LLL'),
      endTime: moment(props.event.end).format('LLL'),
      title: (props.event.title || '').toUpperCase(),
      celebrityName: props.event.extendedProps?.celebrityName || 'N/A',
      organizerName: props.event.extendedProps?.organizerName || 'N/A',
      phoneNumber: props.event.extendedProps?.phoneNumber || 'N/A',
      organizationName: props.event.extendedProps?.organizationName || 'N/A',
      venue: props.event.extendedProps?.venue || 'N/A',
    };
  }, [props.event]);

  if (!formattedEventData) return null; // Render nothing if there is no event data

  return (
    <div>
      <Modal
        open={props?.open}
        onClose={props?.handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 1 }} >
            <span>Start Time: {formattedEventData.startTime}</span><br />
            <span>End Time: {formattedEventData.endTime}</span>
          </Typography>
          <Box sx={[style, { textAlign: 'center', width: 500 }]}>
            <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }} >
              {formattedEventData.title}
            </Typography>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 1, ml: 3, textAlign: 'left' }} >
              <span><b>Organizer Name</b>: {formattedEventData.organizerName}</span><br />
              <span><b>Organization Name</b>: {formattedEventData.organizationName}</span><br />
              <span><b>Phone Number</b>: {formattedEventData.phoneNumber}</span><br />
              {!isEmpty(props?.show) ? <><span><b>Celebrity Name</b>: {formattedEventData.celebrityName}</span><br /></> : ""}
              <span><b>Event Venue</b>: {formattedEventData.venue}</span><br />
              <span><b>Start Time</b>: {formattedEventData.startTime}</span><br />
              <span><b>End Time</b>: {formattedEventData.endTime}</span><br />
            </Typography>
            {isEmpty(props.show) ? (
              <>
                <Typography id="keep-mounted-modal-title" variant="h6" style={{ fontWeight: 'bold', margin: '1rem' }} >
                  Do you want to cancel this Event?
                </Typography>
                <ChildModal {...props} />
              </>
            ) : ""}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export const BlockDatesModal = (props) => {

  let { blockDates } = props;

  return (
    <Modal open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h5">
          Do you want to block these dates?
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
          <span className='from-to'>From</span>: {moment(blockDates?.startStr).format('LLL')} <br />
          <span className='from-to'>To</span>: {moment(blockDates?.endStr).subtract(1, 'minute').format('LLL')}
        </Typography>
        <div className='modal-button'>
            <Button variant='contained' style={{ marginRight: '10px' }} onClick={() => props.handleBlockDate(blockDates.start, blockDates.end)} color='error'>Yes</Button>
            <Button variant='contained' onClick={props.handleClose}>No</Button>
          </div>
      </Box>
    </Modal>
  )
}

export const UnBlockModal = (props) => {
  
  const { unBlockDate } = props;

  return (
    <Modal open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h5" style={{ textAlign : 'center'}}>
          Date is Blocked...Do you want to Unblock???
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
          <span className='from-to'>From</span>: {moment(unBlockDate[0]?.start).format('LLL')} <br />
          <span className='from-to'>To</span>: {moment(unBlockDate[0]?.end).format('LLL')}
        </Typography>
        <div className='modal-button'>
            <Button variant='contained' style={{ marginRight: '10px' }} onClick={() => props.handleUnBlockDate(unBlockDate[0]?.id)} color='error'>Yes</Button>
            <Button variant='contained' onClick={props.handleClose}>No</Button>
          </div>
      </Box>
    </Modal>
  )
}