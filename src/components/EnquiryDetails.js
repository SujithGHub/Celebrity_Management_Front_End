import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { errorHandler } from '../util/Api';
import EnquiryModal from '../util/EnquiryDetailsModal';
import axiosInstance from '../util/Interceptor';
import StatusDropDown from '../util/StatusDropDown';

export default function EnquiryDetails() {

  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [eventInfo, setEventInfo] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  const [celebrity, setCelebrity] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [allEnquiry,setAllEnquiry]=useState(false);
  const [pending, setPending] = useState(true);
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
    if(value === 'All'){
      setAllEnquiry(true);
      setAccepted(false);
      setRejected(false);
      setPending(false);
    }
    else if (value === 'Accepted') {
      setAllEnquiry(false);
      setAccepted(true);
      setRejected(false);
      setPending(false);
    } else if (value === 'Rejected') {
      setAllEnquiry(false);
      setAccepted(false);
      setRejected(true);
      setPending(false);
    } else {
      setAllEnquiry(false);
      setPending(true);
      setAccepted(false);
      setRejected(false);
    }
    setAnchorEl(null);
  };

  const handleClick = (event, key) => {
    setAnchorEl(event.currentTarget);
  };

  const dropDownItem = ['All','Accepted', 'Rejected', 'Pending']

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditable(false);
    setOpen(false);
  }

  const columns = [
    { field: 'enquiryNo', headerName: 'Enquiry', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 40,maxWidth:100 },
    { field: 'celebrityName', headerName: 'Celebrity Name', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 70, valueGetter: (params) => {
          let celebrityName = params.row?.celebrityIds
          return params.row?.celebrity ?params.row?.celebrity.name:  celebrityName?celebrityName.map(name=>name.name):'-'}},
    { field: 'organizationName', headerName: 'Organization', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 50 },
    { field: 'eventName', headerName: 'Event Name', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 110, valueGetter: (row) => {
      return row?.row?.eventName ? row?.row?.eventName : "-"
    } },
    { field: 'name', headerName: 'Organizer Name', type: 'string', headerClassName: 'super-app-theme--header', align: 'left', headerAlign: 'left', flex: 1, minWidth: 50 },
    { field: 'startTime', headerName: 'Start Time', type: 'date', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 180, align: 'center', headerAlign: 'center', editable: editable ? true : false, valueGetter: (row) => {
      return row.row?.startTime ? moment(row.row?.startTime).format('LLL') : "No Date"
    }},
    { field: 'endTime', headerName: 'End Time', type: 'date', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 180, align: 'center', headerAlign: 'center', editable: editable ? true : false, valueGetter: (row) => {
      return row.row?.endTime ? moment(row.row?.endTime).format('LLL') : "No Date"
    }},
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
              <Button onClick={() => handleEventSave(row)}>Process</Button>
              {/* <Button color='error' onClick={(event) => handleEventSubmit(event, row?.row, 'REJECTED')}>
                Cancel
              </Button> */}
            </>
          )
        }
      }
    },
    {
      field: 'save',
      headerName: editable ? 'Save' : 'Edit',
      headerClassName: 'super-app-theme--header',
      hide: pending,
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
    if (key !== "PENDING") {
      if (row?.celebrityIds.length === 1) {
        row = {...row, celebrity : row.celebrityIds[0]}
    }
  }
  if (_.isEmpty(row?.celebrity)) {
    toast.error("Select Celebrity");
    return
  }
    const acceptedSchedule = { ...row, status: key };
    const schedule = { enquiryDetails: acceptedSchedule };
    axiosInstance.post(`/enquiry/status`, schedule).then(() => {
      setOpen(false);
      getAllEnquiry();
      toast.success(key === "ACCEPTED" ? "Enquiry Accepted and Email Sent Successfully" : "Event Rejected Successfully");
      setEditable(false);
    }).catch(err => {
      // toast.error(err?.response?.data?.message)
    });
  };

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
    }).catch(err => errorHandler(err))
  }

  return (
    <Box sx={{ height: 400, width: '100%'}}>
      <div style={{ textAlign: 'end', padding: '10px', paddingRight: 0 }} >
        <StatusDropDown openMenu={openMenu} anchorEl={anchorEl} handleMenuClose={handleMenuClose} handleClick={handleClick} dropDownItem={dropDownItem} status={(allEnquiry ? 'all' : accepted ? 'accepted' : rejected ? 'rejected' : 'pending')} />
      </div>
      <DataGrid
        rows={(allEnquiry === true ? enquiryList:accepted === true ? acceptedEnquiry : rejected === true ? rejectedEnquiry : pendingEnquiry)}
        columns={columns}
        autoHeight
        pagination
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        pageSize={pageSize}
        sortModel={[{field: "enquiryNo", sort:'desc'}]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      {editable && open ? <EnquiryModal open={open} handleOpen={() => handleOpen()} celebrity={celebrity} handleClose={() => handleClose()} eventInfo={eventInfo} submitHandler={handleEventSubmit} /> : ""}
    </Box>
  );
}