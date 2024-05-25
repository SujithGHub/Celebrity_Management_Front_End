import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { TextFieldInput } from '../common/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  
  p: 4,
};

export default function TopicModal(props) {
  return (
    <div>
     
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" style={{display:'flex',justifyContent:'center'}}>
           {props.title ? "Add Topic":"Edit Topic" } 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 ,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
           <TextFieldInput label={'Topic'} value={props.selectedTopic?.name} name={'name'}  inputType={'text'} required={true} onChange={props.changeHandler} />
           <Button onClick={props.setAllTopics}  style={{backgroundColor:'rgb(245, 130, 31)',width:'5rem',color:'white'}}>{props.title?"ADD":"Update"}</Button>
          </Typography>
        </Box>
      </Modal>
      
    </div>
  );
}
