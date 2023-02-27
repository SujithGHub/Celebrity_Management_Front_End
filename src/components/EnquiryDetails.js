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
import { authHeader, errorHandler } from '../util/Api';
import { REST_API } from '../util/EndPoints';
import EnquiryModal from '../util/EnquiryDetailsModal';
import StatusDropDown from '../util/StatusDropDown';

export default function EnquiryDetails() {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [eventInfo, setEventInfo] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [, setPending] = useState(false);
  const [acceptedEnquiry, setAcceptedEnquiry] = useState([]);
  const [rejectedEnquiry, setRejectedEnquiry] = useState([]);
  const [pendingEnquiry, setPendingEnquiry] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pageSize, setPageSize] = useState(5);
  const openMenu = Boolean(anchorEl);

  const handleMenuClose = (event, value) => {
    if(value === 'Accepted'){
      setAccepted(true);
      setRejected(false);
      setPending(false);
    } else if (value === 'Rejected'){
      setAccepted(false);
      setRejected(true);
      setPending(false);
    } else {
      setPending(true);
      setAccepted(false);
      setRejected(false);
    }
    setAnchorEl(null);

  };

  const handleClick = (event, key) => {
    setAnchorEl(event.currentTarget);
  };

  const dropDownItem = ['Accepted', 'Rejected', 'Pending']

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditable(false);
    setOpen(false);
  }

  const columns = [
    { field: 'name', headerName: 'Organizer name', align: 'center', headerAlign: 'center', width: 150 },
    { field: 'organizationName', headerName: 'Organization', align: 'center', headerAlign: 'center', width: 150 },
    { field: 'eventName', headerName: 'Event Name', align: 'center', headerAlign: 'center', width: 200, },

    { field: 'celebrityName', headerName: 'Celebrity Name', align: 'center', headerAlign: 'center', width: 120, valueGetter: (params) => params.row.celebrity ? params.row.celebrity?.name : '-'}
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
              Process
            </Button>
            <Button color='error' onClick={(event) => handleDateEdit(row?.row, 'REJECTED')}>
              Cancel
            </Button>
          </>
        )
      }
    },
    {
      field: 'save',
      headerName: editable ? 'Save' : 'Edit',
      hide: accepted || rejected,
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
    console.log(row, "row");
    setEventInfo(row);
    setOpen(true);
    setEditable(true);
  }

  const handleDateEdit = (row, key) => {
    console.log(new Date(row.startTime).getTime());
    const schedule = {};
    schedule['eventName'] = row.eventName;
    schedule['startTime'] = new Date(row.startTime).getTime();
    schedule['endTime'] = new Date(row.endTime).getTime();
    schedule['status'] = key;
    schedule['availability'] = 'AVAILABLE';
    schedule['celebrity'] = row.celebrity;
    schedule['enquiryId'] = row.id;
    console.log(schedule, "schedule");
    axios.post(`${REST_API}/enquiry/status`, schedule, { headers: authHeader() }).then(response => {
      getAllEnquiry();
      toast.success("Status Changed");
    }).catch(error => {
      errorHandler(error);
    })
  }

  useEffect(() => {
    getAllEnquiry();
  }, [])

  const getAllEnquiry = async () => {
    await axios.get(`${REST_API}/enquiry/get-all-enquiry`, { headers: authHeader()}).then(response => {
        const res = response.data;
        setEnquiryList(res);
        const formattedEnquiry = _.map(res, (en, index) => ({         // total enquiry detail
          ...en, startTime: moment(en.startTime).format("LLL"), endTime: moment(en.endTime).format("LLL"),
        }));
        setAcceptedEnquiry(formattedEnquiry.filter(en => en.status === "ACCEPTED"));
        setRejectedEnquiry(formattedEnquiry.filter(en => en.status === "REJECTED"));
        setPendingEnquiry(formattedEnquiry.filter(en => en.status === 'PENDING'))
      }).catch(error => {
        console.log(error);
      })
  }

  const submitHandler = (schedule) => {
    const scheduleObj = _.filter(enquiryList, (en) => en.id === schedule.id);
    const saveSchedule = { ...scheduleObj[0], eventName: schedule.eventName, startTime: new Date(schedule.startTime).getTime(), endTime: new Date(schedule.endTime).getTime() };
    axios.post(`${REST_API}/enquiry`, saveSchedule, { headers: authHeader() }).then((response) => {
      setOpen(false);
      setEditable(false);
      toast.success("Changes Saved");
      getAllEnquiry();
    }).catch(error => {
      console.log(error, 'schedule error');
    })
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ textAlign: 'center', padding: '1rem' }}>Enquiry Details</h3>
        <Button onClick={() => navigate('/celebrity-details')}>Celebrity Details</Button>
      </div>
      <div style={{ textAlign: 'end', padding: '10px' }} >
        <StatusDropDown openMenu={openMenu} anchorEl={anchorEl} handleMenuClose={handleMenuClose} handleClick={handleClick} dropDownItem={dropDownItem} status={(accepted ? 'accepted' : rejected ? 'rejected' : 'pending')}/>
      </div>
      <DataGrid
        rows={(accepted === true ? acceptedEnquiry : rejected === true ? rejectedEnquiry : pendingEnquiry)}
        columns={columns}
        autoHeight
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      {editable && open ? <EnquiryModal open={open} handleOpen={() => handleOpen()} handleClose={() => handleClose()} eventInfo={eventInfo} submitHandler={submitHandler} /> : ""}
    </Box>
  );
}