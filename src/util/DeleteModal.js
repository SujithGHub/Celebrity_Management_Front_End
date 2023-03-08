import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Celebration } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteModal(props) {

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
           Do you want to delete {props.selectedCelebrity?.name}
          </Typography>
          <div className='modal-button'>
            <Button onClick={()=>props.deleteHandler(props.selectedCelebrity?.id, props.selectedCelebrity?.name)}>Yes</Button>
            <Button onClick={()=>props.handleClose()}>No</Button>
            </div>
        </Box>
      </Modal>
    </div>
  );
}