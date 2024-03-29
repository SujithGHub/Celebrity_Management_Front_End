import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import EnquiryModal from '../util/EnquiryDetailsModal';
import axiosInstance from '../util/Interceptor';
import StatusDropDown from '../util/StatusDropDown';

export default function EnquiryDetails() {

  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [eventInfo, setEventInfo] = useState([]);
  const [, setEnquiryList] = useState([]);
  const [celebrity, setCelebrity] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [, setPending] = useState(false);
  const [acceptedEnquiry, setAcceptedEnquiry] = useState([]);
  const [rejectedEnquiry, setRejectedEnquiry] = useState([]);
  const [pendingEnquiry, setPendingEnquiry] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pageSize, setPageSize] = useState(5);
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
    { field: 'name', headerName: 'Organizer name', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 50 },
    { field: 'organizationName', headerName: 'Organization', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 50 },
    { field: 'eventName', headerName: 'Event Name', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 110, },
    { field: 'celebrityName', headerName: 'Celebrity Name', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 70, valueGetter: (params) => params.row.celebrity ? params.row.celebrity?.name : '-', },
    { field: 'startTime', headerName: 'Start', type: 'date', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 180, align: 'center', headerAlign: 'center', editable: editable ? true : false, valueGetter: (row) => moment(row.row?.startTime).format('LLL') },
    { field: 'endTime', headerName: 'End', type: 'date', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 180, align: 'center', headerAlign: 'center', editable: editable ? true : false, valueGetter: (row) => moment(row.row?.endTime).format('LLL')},
    {
      field: 'action', headerName: 'Action',headerClassName: 'super-app-theme--header', flex: 1, minWidth: 200, align: 'center', headerAlign: 'center',
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
              <Button color='error' onClick={(event) => handleEventSubmit(event, row?.row, 'REJECTED')}>
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
      headerClassName: 'super-app-theme--header',
      hide: accepted || rejected,
      flex: 1, maxWidth: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (row) => <Button onClick={() => handleEventSave(row)}>{<EditIcon />}</Button>
    },
  ];

  const handleEventSave = (row) => {
    setEventInfo(row?.row);
    setOpen(true);
    setEditable(true);
  }

  const handleEventSubmit = (event, row, key) => {
    event.preventDefault();
    if (!_.isEmpty(row?.celebrity)) {
      const acceptedSchedule = { ...row, status: key }
      const schedule = { enquiryDetails: acceptedSchedule }
      axiosInstance.post(`/enquiry/status`, schedule).then(() => {
        setOpen(false);
        getAllEnquiry();
        toast.success(key === 'ACCEPTED' ? "Enquiry Accepted and Email Sent Successfully" : "Enquiry Rejected ");
        setEditable(false);
      })
    } else {
      toast.error("Select Celebrity")
    }
  }

  const getAllCelebrity = async () => {
    await axiosInstance.get(`/celebrity/get-all-celebrity`).then(res => {
      const response = res.filter(fil => fil.status === 'ACTIVE');
      setCelebrity(response)
    })
  }

  const getAllEnquiry = async () => {
    await axiosInstance.get(`/enquiry/get-all-enquiry`).then(res => {
      const enquiry = res.response;
      setEnquiryList(enquiry);
      setAcceptedEnquiry(enquiry.filter(en => en.status === "ACCEPTED"));
      setRejectedEnquiry(enquiry.filter(en => en.status === "REJECTED"));
      setPendingEnquiry(enquiry.filter(en => en.status === 'PENDING'));
    })
  }

  return (
    <Box sx={{ height: 400, width: '100%', paddingTop: '70px'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <Button className='primary' onClick={() => navigate('/processing')}>Schedule List</Button> */}
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
        sortModel={[{field: "startTime", sort:'asc'}]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      {editable && open ? <EnquiryModal open={open} handleOpen={() => handleOpen()} celebrity={celebrity} handleClose={() => handleClose()} eventInfo={eventInfo} submitHandler={handleEventSubmit} /> : ""}
    </Box>
  );
}