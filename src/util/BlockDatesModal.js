import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import moment from 'moment';

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
  borderRadius: '15px',
};

export default function BlockDatesModal(props) {

  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);

  let { blockDates } = props;

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to block these dates?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className='from-to'>From</span>: {moment(blockDates.startStr).format('LLL')}
          </Typography>
          <Typography id="modal-modal-description">
            <span className='from-to'>To</span>: {moment(blockDates.endStr).format('LLL')}
          </Typography>
          <div className='modal-button'>
            <Button variant='contained' style={{ marginRight: '10px' }} onClick={() => props.handleBlockDate(blockDates.start, blockDates.end)} color='error'>Yes</Button>
            <Button variant='contained'>No</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}