import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authHeader, errorHandler } from '../util/Api';
import BasicModal from '../util/EnquiryDetailsModal';
import { REST_API } from '../util/EndPoints';
import BlockDatesModal from '../util/BlockDatesModal';
import { toast } from 'react-toastify';

const Calendar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [celebrity,setCelebrity] = useState([])
  
  const [events, setEvents] = useState([]);
  const [weekEndAvailability, setWeekEndAvailability] = useState(true)
  const [open, setOpen] = useState(false);
  const [openBlockDate, setOpenBlockDate] = useState(false);
  const [, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [blockDates, setBlockDates] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlockDatesOpen = () => setOpenBlockDate(true);
  const handleBlockDatesClose = () => setOpenBlockDate(false);
  
  
  useEffect(() => {
    setCelebrity(location.state?.c)
    getEvents(celebrity?.id);
  },[celebrity])

 const handleLogOut=()=>{
  window.location.href='/celebrity-details';
 }

  const renderSidebar = () => {
    return (
      <div className='demo-app-sidebar' style={{display: 'flex', justifyContent: 'space-between', padding: '10px 40px 0 0'}}>
        <div className='demo-app-sidebar-section'>
          <h4>Available Events : <span style={{color: 'red'}}>{events.length}</span></h4>
        </div>
        <div className='demo-app-sidebar-section' style={{display: 'flex',flexDirection: 'column', alignItems: 'center'}}>
            <Button onClick={()=>handleLogOut()}><LogoutIcon/></Button>
          <h2>{celebrity?.name}</h2>
        </div>
      </div>
    )
  }

  const getEventColor = (start) => start > moment().format() ? 'green' : 'red'

  const getEvents = (celebrityId) => {
    axios.get(`${REST_API}/schedule/celebrity-id/${celebrityId}`,{ headers: authHeader()}).then(res => {
      const response = res.data
      setAllEvents(response);
      const filteredEvents = _.filter(response, (res => moment().format()));
      const formattedEvents = _.map(filteredEvents, (event, key) => ({
        id: event.id,
        title: event.eventName,
        start: moment(event.startTime).format(),
        end: moment(event.endTime).format(),
        status: (moment(event.startTime).format() < moment().format()) ? "COMPLETED" : "PENDING",
        color: getEventColor(moment(event.startTime).format()),
      }))
      console.log(formattedEvents)
      setEvents(formattedEvents)
    }).catch(error => {
      errorHandler(error);
    })
  }

  const handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr)
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.toPlainObject());
    setOpen(true);
  }

  const handleStatusChange = (scheduleId, status) => {
    axios.post(`${REST_API}/schedule/status?id=${scheduleId}&status=${status}`, {headers : authHeader()}).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error)
    })
  }

  const handleDateSelect = (args) => {
    console.log(args, "args")
    setBlockDates(args);
    setOpenBlockDate(true);
  }

  const handleBlockDate = (from, to) => {
    console.log(from, "from")
    const blockObj = {};
    blockObj['celebrityId'] = celebrity?.id;
    blockObj['blockedDate'] = from;
    axios.post(`${REST_API}/block-date`, blockObj, {headers : authHeader()}).then((response) => {
      console.log("response", response)
    }).catch(error => {
      toast.error(error?.message)
      console.log(error)
    })
  }

    return (
      <>
      {renderSidebar()}
        <FullCalendar
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          eventColor={""}
          ref={calendarRef}
          aspectRatio={3}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          weekends={weekEndAvailability}
          selectable={true}
          events={events}
          selectAllow={(event) => event.start < new Date() ? false : true}
          select={(event) => handleDateSelect(event)}
          dayMaxEvents={true}
          eventClick={(event) => handleEventClick(event)}
        />
        {open && selectedEvent.extendedProps.status === 'PENDING' ? <BasicModal open={open} handleClose={handleClose} handleOpen={handleOpen} event={selectedEvent} handleStatusChange={handleStatusChange}/> : ""}
        {openBlockDate && <BlockDatesModal open={openBlockDate} handleClose={handleBlockDatesClose} handleOpen={handleBlockDatesOpen} handleBlockDate={handleBlockDate} blockDates={blockDates} />} 
    </>
    )
  }

  export default Calendar
