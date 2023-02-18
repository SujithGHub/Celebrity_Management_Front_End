import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authHeader } from '../util/Api';
import BasicModal from '../util/BasicModal';
import { REST_API } from '../util/EndPoints';

export default function TestingCalendar() {

  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState([]);
  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [eventInfo, setEventInfo] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  const [formattedEnquiry, setFormattedEnquiry] = useState([]);
  const [acceptedOrRejectedEnquiry, setAcceptedOrRejectedEnquiry] = useState([]);
  const [pendingEnquiry, setPendingEnquiry] = useState([]);
  const [accepted, setAccepted] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditable(false);
    setOpen(false);
  }

  const columns = [
    { field: 'name', headerName: 'Organizer name', align: 'center', headerAlign: 'center', width: 120 },
    { field: 'organizationName', headerName: 'Organization', align: 'center', headerAlign: 'center', width: 150 },
    { field: 'eventName', headerName: 'Event Name', align: 'center', headerAlign: 'center', width: 170, },

    { field: 'celebrityName', headerName: 'Celebrity Name', align: 'center', headerAlign: 'center', width: 120, valueGetter: (params) => params.row.celebrity?.name }
    ,
    { field: 'startTime', headerName: 'Start', type: 'date', width: 210, align: 'center', headerAlign: 'center', editable: editable ? true : false, },
    { field: 'endTime', headerName: 'End', type: 'date', width: 210, align: 'center', headerAlign: 'center', editable: editable ? true : false, },
    {
      field: 'action', headerName: 'Action', width: 200, align: 'center', headerAlign: 'center',
      renderCell: (row) => {
        const { status } = row.row;
        if (status === "ACCEPTED") {
          return (
            <Button color='success' onClick={(event) => toast.info('Status Already Updated!!!')}>
              ACCEPTED
            </Button>
          )
        } else if (status === "REJECTED") {
          return (
            <Button color='error' onClick={(event) => toast.info('Status Already Updated!!!')}>
              REJECTED
            </Button>
          )
        }
        return (
          <>
            <Button onClick={(event) => handleDateEdit(row?.row, 'ACCEPTED')}>
              Accept
            </Button>
            <Button color='error' onClick={(event) => handleDateEdit(row?.row, 'REJECTED')}>
              Reject
            </Button>
          </>
        )
      }
    },
    {
      field: 'save',
      headerName: editable ? 'Save' : 'Edit',
      hide: accepted,
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (row) =>
        <>
          {editable ?
            <Button onClick={() => handleEventEdit(row)}>{<DoneIcon />}</Button>
            : <Button onClick={() => handleEventSave(row)}>{<EditIcon />}</Button>}
        </>
    },
  ];

  const handleEventEdit = (row) => {
    setEditable(false);
  }

  const handleEventSave = (row) => {
    setEventInfo(row);
    setOpen(true);
    setEditable(true);
  }

  const handleDateEdit = (row, key) => {
    const schedule = {};
    schedule['eventName'] = row.eventName;
    schedule['startTime'] = new Date(row.startTime).getTime();
    schedule['endTime'] = new Date(row.endTime).getTime();
    schedule['status'] = key;
    schedule['availability'] = 'AVAILABLE';
    schedule['celebrity'] = row.celebrity;
    schedule['enquiryId'] = row.id;
    console.log(schedule);
    axios.post(`${REST_API}/enquiry/status`, schedule, { headers: authHeader() }).then(response => {
      console.log(response);
      getAllEnquiry();
      toast.success("Status Changed");
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    getAllEnquiry();
  }, [])

  const getAllEnquiry = async () => {
    await axios.get(`${REST_API}/enquiry/get-all-enquiry`, { headers: authHeader() }).
      then(response => {
        const res = response.data;
        setEnquiryList(res);
        console.log(res, "response");
        // const formattedEnquiry = _.map(res, (en, index) => ({
        //   id: en.id,
        //   index: index + 1,
        //   name: en.name,
        //   eventName: en.eventName,
        //   startTime: moment(en.startTime).format("LLL"),
        //   endTime: moment(en.endTime).format("LLL"),
        //   celebrity: en.celebrity
        // }))
        const formattedEnquiry = _.map(res, (en, index) => ({         // total enquiry detail
          ...en, startTime: moment(en.startTime).format("LLL"), endTime: moment(en.endTime).format("LLL"),
        }));
        setAcceptedOrRejectedEnquiry(formattedEnquiry.filter(en => en.status === "ACCEPTED" || en.status === "REJECTED"));
        setPendingEnquiry(formattedEnquiry.filter(en => en.status === 'PENDING'))
      }).catch(error => {
        console.log(error);
      })
  }

  const submitHandler = (schedule) => {
    const scheduleObj = _.filter(enquiryList, (en) => en.id === schedule.id);
    console.log(scheduleObj, "scheduleObj");
    const saveSchedule = { ...scheduleObj[0], eventName: schedule.eventName, startTime: new Date(schedule.startTime).getTime(), endTime: new Date(schedule.endTime).getTime() };
    axios.post(`${REST_API}/enquiry`, saveSchedule, { headers: authHeader() }).then((response) => {
      setOpen(false);
      setEditable(false);
      getAllEnquiry();
    }).catch(error => {
      console.log(error, 'schedule error');
    })
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ textAlign: 'center', padding: '1rem' }}>Enquiry Details</h3>
        <Button onClick={() => navigate('/celebrity-details')}> ...Celebrity Details</Button>
      </div>
      <div style={{ textAlign: 'end', padding: '10px' }} >
        <Button className='primary' color='info' title={accepted ? 'Show Pending' : 'Show Accepted/Rejected'} variant='contained' onClick={() => { setAccepted(!accepted) }}>{accepted ? 'Show Pending' : 'Show Acc/Rej'}</Button>
      </div>
      <DataGrid
        rows={accepted ? acceptedOrRejectedEnquiry : pendingEnquiry}
        columns={columns}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      {editable && open ? <BasicModal open={open} handleOpen={() => handleOpen()} handleClose={() => handleClose()} eventInfo={eventInfo} submitHandler={submitHandler} /> : ""}
    </Box>
  );
}