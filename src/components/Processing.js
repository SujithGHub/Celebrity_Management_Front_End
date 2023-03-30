import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHeader } from "../util/Api";
import { REST_API } from "../util/EndPoints";
import StatusDropDown from '../util/StatusDropDown';

export const Processing = () => {

  const navigate = useNavigate();

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
    await axios.get(`${REST_API}/enquiry/get-all-enquiry`, { headers: authHeader() }).then(res => {
      const response = res.data.response;
      setSchedule(response);
      setAvailableEvents(response.filter(res => res.startTime > new Date().getTime()));
      setCompletedEvents(response.filter(res => res.startTime < new Date().getTime()));
    }).catch(error => {
      console.log(error);
    })
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Organizer Name',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'organizationName',
      headerName: 'Organization Name',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 50,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'eventName',
      headerName: 'EventName',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'CelebrityName',
      headerName: 'Celebrity Name',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
      valueGetter: (params) => params.row?.celebrity ? params.row?.celebrity?.name : "-",
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'location',
      headerName: 'Event place',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'startTime',
      headerName: 'StartTime',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      minWidth: 180,
      flex: 1,
      editable: false,
      renderCell: (param) => moment(param?.row?.startTime).format('LLL'),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'endTime',
      headerName: 'EndTime',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      minWidth: 180,
      flex: 1,
      editable: false,
      renderCell: (param) => moment(param?.row?.endTime).format('LLL'),
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'mailId',
      headerName: 'MailId',
      headerClassName: 'super-app-theme--header',
      type: 'string',
      minWidth: 180,
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'left'
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
      align: 'center'

    },
  ];
  return (
    <div>
      <div className="processing-header">
        <Button className="primary" color="error" title="Back" onClick={() => navigate('/enquiry-details')} ><ArrowBackIcon /></Button>
        <h2>{completed ? 'COMPLETED EVENTS' : 'UPCOMING EVENTS'}</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <Button className='primary' onClick={() => navigate('/celebrity-details')}>Celebrity Details</Button> */}
          <StatusDropDown dropDownItem={dropDownItem} buttonName={'Event'} anchorEl={anchorEl} handleClick={handleClick} handleMenuClose={handleMenuClose} openMenu={openMenu} ></StatusDropDown>
        </div>
      </div>
      <Box sx={{ height: 400, width: '100%' }}>
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
