import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EnquiryModal from '../util/EnquiryDetailsModal';
import axiosInstance from '../util/Interceptor';
import StatusDropDown from '../util/StatusDropDown';

export default function EnquiryDetails() {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [eventInfo, setEventInfo] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  const [celebrity, setCelebrity] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [, setPending] = useState(false);
  const [acceptedEnquiry, setAcceptedEnquiry] = useState([]);
  const [rejectedEnquiry, setRejectedEnquiry] = useState([]);
  const [pendingEnquiry, setPendingEnquiry] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pageSize, setPageSize] = useState(10);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    getAllEnquiry();
    getAllCelebrity();
  }, [])

  const handleMenuClose = (event, value) => {
    if (value === 'Accepted') {
      setAccepted(true);
      setRejected(false);
      setPending(false);
    } else if (value === 'Rejected') {
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
    { field: 'celebrityName', headerName: 'Celebrity Name', align: 'center', headerAlign: 'center', width: 120, valueGetter: (params) => params.row.celebrity ? params.row.celebrity?.name : '-', },
    { field: 'startTime', headerName: 'Start', type: 'date', width: 210, align: 'center', headerAlign: 'center', editable: editable ? true : false ,renderCell: (row) => moment(row?.row?.startTime).format('LLL') },
    { field: 'endTime', headerName: 'End', type: 'date', width: 210, align: 'center', headerAlign: 'center', editable: editable ? true : false, renderCell: (row) => moment(row?.row?.endTime).format('LLL') },
    {
      field: 'action', headerName: 'Action', width: 210, align: 'center', headerAlign: 'center',
      renderCell: (row) => {
        const { status } = row.row;
        if (status === "ACCEPTED") {
          return (
            <Button color='success' onClick={(event) => toast.info('Already Accepted!!!')}>
              ACCEPTED
            </Button>
          )
        } else if (status === "REJECTED") {
          return (
            <Button color='error' onClick={(event) => toast.info('Already Rejected!!!')}>
              REJECTED
            </Button>
          )
        } else {
          return (
            <>
              <Button onClick={() => handleEventSave(row)}>
                {editable ? 'InProgress' : 'Process'}
              </Button>
              <Button color='error' onClick={(event) => handleEventSubmit(row?.row, 'REJECTED')}>
                Cancel
              </Button>
            </>
          )
        }
      }
    },
    {
      field: 'save',
      headerName: editable ? 'Save' : 'Edit',
      hide: accepted || rejected,
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (row) => <Button onClick={() => handleEventSave(row)}>{<EditIcon />}</Button>
    },
  ];

  const handleEventEdit = (row) => {
    setEditable(false);
  }

  const handleEventSave = (row) => {
    setEventInfo(row?.row);
    setOpen(true);
    setEditable(true);
  }
const [enquiryDetails, setEnquiryDetails] = useState({
  
})
  const handleEventSubmit = (row, key) => {
    console.log(row, "enquiryId")
    if (!_.isEmpty(row.celebrity)) {
      // const schedule = {};
      // schedule['startTime'] = new Date(row.startTime).getTime();
      // schedule['endTime'] = new Date(row.endTime).getTime();
      // schedule['status'] = key;
      // schedule['celebrity'] = row.celebrity;
      // schedule['enquiryId'] = row.id;
      // schedule["eventName"] = row.eventName;
      const sched = {...row, status: key}
      const schedule = {enquiryDetails: sched}
      axiosInstance.post(`/enquiry/status`, schedule).then(response => {
        getAllEnquiry();
        toast.success(key === 'ACCEPTED' ? "Enquiry Accepted" : "Enquiry Rejected ");
        setOpen(false);
        setEditable(false);
      })
    } else {
      toast.error("Select Celebrity")
    }
  }

  const getAllCelebrity = async () => {
    await axiosInstance.get(`/celebrity/get-all-celebrity`).then(res => {
      setCelebrity(res)
    })
  }

  const getAllEnquiry = async () => {
    const res = await axiosInstance.get(`/enquiry/get-all-enquiry`).then(res => {
      const enquiry = res.response;
      setEnquiryList(enquiry);
      setAcceptedEnquiry(enquiry.filter(en => en.status === "ACCEPTED"));
      setRejectedEnquiry(enquiry.filter(en => en.status === "REJECTED"));
      setPendingEnquiry(enquiry.filter(en => en.status === 'PENDING'));
    })
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ textAlign: 'center', padding: '1rem' }}>Enquiry Details</h3>
        <Button className='primary' onClick={() => navigate('/processing')}>Schedule List</Button>
      </div>
      <div style={{ textAlign: 'end', padding: '10px' }} >
        <StatusDropDown openMenu={openMenu} anchorEl={anchorEl} handleMenuClose={handleMenuClose} handleClick={handleClick} dropDownItem={dropDownItem} status={(accepted ? 'accepted' : rejected ? 'rejected' : 'pending')} />
      </div>
      <DataGrid
        rows={(accepted === true ? acceptedEnquiry : rejected === true ? rejectedEnquiry : pendingEnquiry)}
        columns={columns}
        autoHeight
        pagination
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        pageSize={pageSize}
        // sortModel={[{field: "start", sort:'asc'}]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      {editable && open ? <EnquiryModal open={open} handleOpen={() => handleOpen()} celebrity={celebrity} handleClose={() => handleClose()} eventInfo={eventInfo} submitHandler={handleEventSubmit} /> : ""}
    </Box>
  );
}