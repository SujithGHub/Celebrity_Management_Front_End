import { Box, Button } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StatusDropDown from '../util/StatusDropDown';
import { useEffect, useState } from "react";
import { REST_API } from "../util/EndPoints";
import axios from "axios";
import { authHeader } from "../util/Api";
import moment from "moment";
import { formatDate } from "@fullcalendar/core";
import { logDOM } from "@testing-library/react";

export const Processing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [available, setAvailable] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const dropDownItem = ['UpcomingEvents', 'CompletedEvents']
  const openMenu = Boolean(anchorEl);

  const handleBack = () => {
    window.location.href = "/enquiry-details"
  }
  const handleClick = (event, key) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (e, value) => {
    if (value === 'UpcomingEvents') {
      setAvailable(true);
      setCompleted(false);
    } else if (value === 'CompletedEvents') {
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
      console.log(response, "enquiry");
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
      width: 100,
      editable: false,
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'organizationName',
      headerName: 'Organization Name',
      width: 150,
      editable: false,
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'eventName',
      headerName: 'EventName',
      type: 'number',
      width: 150,
      editable: false,
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'CelebrityName',
      headerName: 'Celebrity Name',
      type: 'number',
      width: 150,
      editable: false,
      valueGetter: (params) => params.row.celebrity ? params.row.celebrity?.name : "-",
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'location',
      headerName: 'Event place',
      type: 'number',
      width: 190,
      editable: false,
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'startTime',
      headerName: 'StartTime',
      type: 'number',
      width: 200,
      editable: false,
      renderCell: (param) => moment(param?.row.startTime).format('LLL'),
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'endTime',
      headerName: 'EndTime',
      type: 'number',
      width: 200,
      editable: false,
      renderCell: (param) => moment(param?.row.endTime).format('LLL'),
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'mailId',
      headerName: 'MailId',
      type: 'number',
      width: 150,
      editable: false,
      headerAlign: 'center',
      align: 'left'
    },
    {
      field: 'phoneNumber',
      headerName: 'Contact Number ',
      width: 130,
      editable: false,
      headerAlign: 'center',
      align: 'left'

    },
  ];
  return (
    <div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Processing Table</h1>
        <Button className="primary" color="error" title="Back" onClick={() => handleBack()}><ArrowBackIcon /></Button>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
        <StatusDropDown dropDownItem={dropDownItem} anchorEl={anchorEl} handleClick={handleClick} handleMenuClose={handleMenuClose} openMenu={openMenu} ></StatusDropDown>
      </div>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={(completed ? completedEvents : availableEvents)}
          columns={columns}
          pageSize={5}
          autoHeight
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          sortModel={[{ field: "startTime", sort: 'asc' }]}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  )
}
