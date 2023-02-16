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
  boxShadow: 24,
  p: 3,
  outline: "none",
};


export default function BasicModal(props) {

  console.log(props, "props");

  return (
      <Modal
        keepMounted
        style={{zIndex: 99999}}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h4" component="h2" style={{fontWeight: 'bold'}} >
            {props.event?.title}
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }} >
            <span>Start Time: {moment(props.event?.start).format("ddd, hA")}</span>
            <span>End Time: {moment(props.event?.end).format("ddd, hA")}</span>
          </Typography>
          {/* <div className='modal-buttons'>
          <Button color='primary' style={{marginRight: '10px'}} onClick={() => props.handleStatusChange(props.event?.id, 'ACTIVE')} variant='contained'>Accept</Button>
          <Button color='error' variant='contained' onClick={() => props.handleStatusChange(props.event?.id, 'INACTIVE')}>Reject</Button>
          </div> */}
        </Box>
      </Modal>
  );
}