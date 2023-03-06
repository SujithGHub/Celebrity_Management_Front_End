import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../util/Api';
import BlockDatesModal from '../util/BlockDatesModal';
import { REST_API } from '../util/EndPoints';
import BasicModal from '../util/EnquiryDetailsModal';

const Calendar = () => {

  const location = useLocation();
  // const navigate = useNavigate();
  const calendarRef = useRef(null);

  const { c } = location.state

  const [celebrity,] = useState(c)
  const [events, setEvents] = useState([]);
  const [weekEndAvailability,] = useState(true)
  const [open, setOpen] = useState(false);
  const [openBlockDate, setOpenBlockDate] = useState(false);
  const [, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [blockDates, setBlockDates] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlockDatesOpen = () => setOpenBlockDate(true);
  const handleBlockDatesClose = () => setOpenBlockDate(false);


  useEffect(() => {
    getEvents(celebrity?.id);
    getBlockedDates(c?.id);
  }, [celebrity])

  const handleLogOut = () => {
    window.location.href = '/celebrity-details';
  }

  const renderSidebar = () => {
    return (
      <div className='demo-app-sidebar' style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 40px 0 15px' }}>
        <div className='demo-app-sidebar-section'>
          <h4>Available Events : <span style={{ color: 'red' }}>{events.length}</span></h4>
          <h2>{celebrity?.name}</h2>
        </div>
        <div className='demo-app-sidebar-section' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button onClick={() => handleLogOut()} color='error' title='Back'><ArrowBackIcon /></Button>
        </div>
      </div>
    )
  }

  const getEventColor = (start) => new Date(start) < new Date() ? '#ff1a1a' : '#0d6efd'

  const getBlockedDates = (celebrityId) => {
    axios.get(`${REST_API}/block-date/getByCelebrityId/${celebrityId}`, { headers: authHeader() }).then(response => {
      let res = response.data
      setBlockedDates(res);
    }).catch(error => {
      console.log(error)
    })
  }

  const getEvents = (celebrityId) => {
    axios.get(`${REST_API}/schedule/celebrity-id/${celebrityId}`, { headers: authHeader() }).then(res => {
      const response = res.data
      setAllEvents(response);
      const filteredEvents = _.filter(response, (res => res.status === "ACCEPTED"));
      const formattedEvents = _.map(filteredEvents, (event, key) => ({
        id: event.id,
        title: event.eventName,
        start: event.startTime,
        end: event.endTime,
        status: (event.startTime) < new Date().getTime() ? "COMPLETED" : "PENDING",
        color: getEventColor(event.startTime),
      }))
      setEvents(formattedEvents)
    }).catch(error => {
      errorHandler(error);
    })
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.toPlainObject());
    setOpen(true);
  }

  const handleCancelEvent = (scheduleId, status) => {
    axios.post(`${REST_API}/schedule/status?id=${scheduleId}&status=${status}`, { headers: authHeader() }).then(response => {
      console.log(response)
      setOpen(false);
      getEvents();
    }).catch(error => {
      console.log(error)
      setOpen(false);
    })
  }

  const handleDateSelect = (args) => {
    setBlockDates(args);
    setOpenBlockDate(true);
  }

  const handleBlockDate = (from, to) => {
    const blockObj = {};
    blockObj['celebrityId'] = celebrity?.id;
    blockObj['blockedDate'] = from;
    axios.post(`${REST_API}/block-date`, blockObj, { headers: authHeader() }).then((response) => {
      getBlockedDates(celebrity?.id)
      setOpenBlockDate(false);
      toast.success(response?.data.message);
    }).catch(error => {
      setOpenBlockDate(false);
      toast.error(error?.response?.data.message)
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
        stickyHeaderDates
        themeSystem="bootstrap5"
        ref={calendarRef}
        aspectRatio={3}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
        weekends={weekEndAvailability}
        selectable={true}
        events={events}
        selectAllow={(event) => event.start < new Date() ? false : true}
        select={(event) => handleDateSelect(event)}
        dayMaxEvents={false}
        eventClick={(event) => handleEventClick(event)}
        eventDisplay="block"
        eventMouseEnter={(event) => (event.el.style.cursor = 'pointer')}
      />
      {open && selectedEvent.extendedProps.status === 'PENDING' ? <BasicModal open={open} handleClose={handleClose} handleOpen={handleOpen} event={selectedEvent} handleCancelEvent={handleCancelEvent} /> : ""}
      {openBlockDate && <BlockDatesModal open={openBlockDate} handleClose={handleBlockDatesClose} handleOpen={handleBlockDatesOpen} handleBlockDate={handleBlockDate} blockDates={blockDates} />}
    </>
  )
}

export default Calendar
