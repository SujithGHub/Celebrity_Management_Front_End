import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { authHeader } from "../util/Api";
import { REST_API } from "../util/EndPoints";
import StatusDropDown from '../util/StatusDropDown';

export const Processing = () => {

  const [pageSize, setPageSize] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [, setAvailable] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [, setSchedule] = useState([]);
  const dropDownItem = ['UPCOMING', 'COMPLETED']
  const openMenu = Boolean(anchorEl);

  const handleClick = (event, key) => {
    setAnchorEl(event?.currentTarget);
  };
  const handleMenuClose = (e, value) => {
    if (value === 'UPCOMING') {
      setAvailable(true);
      setCompleted(false);
    } else if (value === 'COMPLETED') {
      setCompleted(true);
      setAvailable(false);
    }
    setAnchorEl(null);
  }

  useEffect(() => {
    getAllSchedule();
  }, [])

  const getAllSchedule = async () => {
    await axios.get(`${REST_API}/schedule/get-all-schedule`, { headers: authHeader() }).then(res => {
      const response = res.data;
      setSchedule(response);
      setAvailableEvents(response.filter(res => res.enquiryDetails?.startTime > new Date().getTime()));
      setCompletedEvents(response.filter(res => res.enquiryDetails?.startTime < new Date().getTime()));
    }).catch(error => {
      console.log(error);
    })
  }
  
  const columns = [
    {
      field: 'scheduleNo',
      headerName: 'Schedule',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 30,
      flex: 1,
      editable: false,
      headerAlign: 'left',
      align: 'left',
      valueGetter: (param) => param?.row?.scheduleNo,
    },
    {
      field: 'CelebrityName',
      headerName: 'Celebrity Name',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 120,
      flex: 1,
      editable: false,
      valueGetter: (params) => params.row?.enquiryDetails?.celebrity ? params.row?.enquiryDetails?.celebrity?.name : "-",
      headerAlign: 'left',
      align: 'left'
    },
    {
      field: 'name',
      headerName: 'Organizer Name',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
      headerAlign: 'left',
      align: 'left',
      valueGetter: (param) => param?.row?.enquiryDetails?.name,
    },
    {
      field: 'organizationName',
      headerName: 'Organization Name',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 100,
      flex: 1,
      editable: false,
      headerAlign: 'left',
      align: 'left',
      valueGetter: (param) => param?.row?.enquiryDetails?.organizationName
    },
    {
      field: 'eventName',
      headerName: 'EventName',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 120,
      flex: 1,
      editable: false,
      headerAlign: 'left',
      align: 'left',
      valueGetter: (param) => param?.row?.enquiryDetails?.eventName ?? "-"
    },
    {
      field: 'venue',
      headerName: 'Event Venue',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 120,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (param) => param?.row?.enquiryDetails?.venue ?? "-"
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      headerClassName: 'super-app-theme--header',
      type: 'date',
      minWidth: 150,
      flex: 1,
      editable: false,
      valueGetter: (param) => moment(param?.row?.enquiryDetails?.startTime).format('LLL'),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      headerClassName: 'super-app-theme--header',
      type: 'date',
      minWidth: 150,
      flex: 1,
      editable: false,
      valueGetter: (param) => moment(param?.row?.enquiryDetails?.endTime).format('LLL'),
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'mailId',
      headerName: 'Email',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 150,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'left',
      valueGetter: (param) => param?.row?.enquiryDetails?.mailId
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'left',
      valueGetter: (param) => param?.row?.enquiryDetails?.status
    },
    {
      field: 'phoneNumber',
      headerName: 'Contact Number ',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      minWidth: 80,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (param) => param?.row?.enquiryDetails?.phoneNumber
    },
  ];
  return (
    <div>
      <div className="processing-header">
        {/* <Button className="primary" color="error" title="Back" onClick={() => navigate('/enquiry-details')} ><ArrowBackIcon /></Button> */}
        <h2>{completed ? 'Completed Events' : 'Upcomming Events'}</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <Button className='primary' onClick={() => navigate('/celebrity-details')}>Celebrity Details</Button> */}
          <StatusDropDown dropDownItem={dropDownItem} buttonName={'Event'} anchorEl={anchorEl} handleClick={handleClick} handleMenuClose={handleMenuClose} openMenu={openMenu} ></StatusDropDown>
        </div>
      </div>
      <Box sx={{ height: 400, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      </div>
        <DataGrid
          rows={(completed ? completedEvents : availableEvents)}
          columns={columns}
          pagination
          pageSize={pageSize}
          autoHeight
          rowSelection={false}
          // disableColumnFilter
          // disableColumnMenu
          // disableColumnSelector
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sortModel={[{ field: "startTime", sort: 'asc' }]}
          rowsPerPageOptions={[5, 10, 15]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  )
}
