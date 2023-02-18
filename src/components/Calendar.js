import { formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authHeader, errorHandler } from '../util/Api';
import BasicModal from '../util/BasicModal';
import { REST_API } from '../util/EndPoints';
import LogoutIcon from '@mui/icons-material/Logout';

const Calendar = () => {

  const location = useLocation();
  const navigate=useNavigate();
  const calendarRef = useRef(null);

  const [celebrity,setCelebrity] = useState([])
  
  const [events, setEvents] = useState([]);
  const [weekEndAvailability, setWeekEndAvailability] = useState(true)
  const [open, setOpen] = useState(false);
  const [, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  
  useEffect(() => {
  // const calendarApi = calendarRef.current?.getApi();
  setCelebrity(location.state?.c)
    getEvents(celebrity?.id);
  },[celebrity])

 const handleLogOut=()=>{
  window.location.href='/celebrity-details';
 }

  function renderSidebar(){
    return (
      <div className='demo-app-sidebar' style={{display: 'flex', justifyContent: 'space-between', padding: '10px 40px 0 0'}}>
        <div className='demo-app-sidebar-section'>
          <h4>Available Events : <span style={{color: 'red'}}>{events.length}</span></h4>
          {/* <ul>
            {events.map((event) => renderSidebarEvent(event))}
          </ul> */}
        </div>
        <div className='demo-app-sidebar-section' style={{display: 'flex',flexDirection: 'column', alignItems: 'center'}}>
            <Button onClick={()=>handleLogOut()}><LogoutIcon/></Button>
          <h2>{celebrity?.name}</h2>
          <label>
            <input type='checkbox' checked={weekEndAvailability} onChange={() => setWeekEndAvailability(!weekEndAvailability)} ></input>
            Toggle weekends
          </label>  
        </div>
      </div>
    )
  }

  function renderSidebarEvent(event) {
    return (
      <li key={event.id}>
        <b>{formatDate(event?.start, {year: 'numeric', month: 'short', day: 'numeric'})} - {formatDate(event?.end, {year: 'numeric', month: 'short', day: 'numeric'})}</b><br />
      <i>{event?.title}</i>
      </li>
    )
  }

  const getEvents = (celebrityId) => {
    axios.get(`${REST_API}/schedule/celebrity-id/${celebrityId}`,{ headers: authHeader()}).then(res => {
      const response = res.data
      console.log(response, "response Calendar Page")
      setAllEvents(response);
      const filteredEvents = _.filter(response, (res => (moment(res.startTime).format() >= moment().format())));
      const formattedEvents = _.map(filteredEvents, (event, key) => ({
        id: event.id,
        title : event.eventName,
        start : moment(event.startTime).format(),
        end : moment(event.endTime).format()
      }))
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

    return (
      <>
      {renderSidebar()}
        <FullCalendar
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          ref={calendarRef}
          aspectRatio={3}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          weekends={weekEndAvailability}
          selectable={true}
          events={events}
          dayMaxEvents={true}
          eventClick={(event) => handleEventClick(event)}
          dateClick={(event) => handleDateClick(event)}
        />
        {open && <BasicModal open={open} handleClose={handleClose} handleOpen={handleOpen} event={selectedEvent} handleStatusChange={handleStatusChange}/>}
    </>
    )
  }

  export default Calendar
