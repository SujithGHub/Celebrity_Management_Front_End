import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import * as React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: 24,
  p: 3,
  outline: "none",
  // textAlign: "center",
  borderRadius: '15px',
};

export default function CalendarModal(props) {

  let { blockDates } = props;

  return (
    <Modal
        open={props?.open}
        onClose={props?.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {props?.event ? <Box sx={[style, {textAlign: 'center', width: 500}]}>
          <Typography id="keep-mounted-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }} >
            {props.event?.title}
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 1 }} >
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
        </Box>
          :
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Do you want to block these dates?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
              <span className='from-to'>From</span>: {moment(blockDates.startStr).format('LLL')} <br />
              <span className='from-to'>To</span>: {moment(blockDates.endStr).subtract(1, 'minute').format('LLL')}
            </Typography>
            {/* <Typography id="modal-modal-description">
            </Typography> */}
            <div className='modal-button'>
              <Button variant='contained' style={{ marginRight: '10px' }} onClick={() => props.handleBlockDate(blockDates.start, blockDates.end)} color='error'>Yes</Button>
              <Button variant='contained' onClick={props.handleClose}>No</Button>
            </div>
          </Box>
          }
      </Modal>
  );
}