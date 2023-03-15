import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Tooltip } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BlockDatesModal, CalendarModal } from '../util/CalendarModal';
import axiosInstance from '../util/Interceptor';
import { WATCH } from '../util/Loader';

const Calendar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const { c } = location.state

  const [celebrity,] = useState(c);
  const [events, setEvents] = useState([]);
  const [weekEndAvailability,] = useState(true)
  const [open, setOpen] = useState(false);
  const [openBlockDate, setOpenBlockDate] = useState(false);
  const [, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [blockDates, setBlockDates] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, ] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlockDatesOpen = () => setOpenBlockDate(true);
  const handleBlockDatesClose = () => setOpenBlockDate(false);

  const getBlockedDates = useCallback((celebrityId) => {
    axiosInstance.get(`/block-date/getByCelebrityId/${celebrityId}`).then(response => {
      setBlockedDates(response);
    })
  }, [])

  const getEvents = useCallback((id) => {
    axiosInstance.get(`/schedule/celebrity-id/${id}`).then(response => {
      setAllEvents(response);
      // const filteredEvents = _.filter(response, (res => res.status === "ACCEPTED"));
      const formattedEvents = _.map(response, (event, key) => ({
        id : event?.id,
        title : event.enquiryDetails?.eventName,
        start : event.enquiryDetails?.startTime,
        end: event.enquiryDetails?.endTime,
        location : event.enquiryDetails?.location,
        phoneNumber : event.enquiryDetails?.phoneNumber,
        organizerName : event.enquiryDetails?.name,
        organizationName : event.enquiryDetails?.organizationName,
        status: getEventStatus(event.enquiryDetails?.startTime, event.enquiryDetails?.status),
        color: getEventColor(event.enquiryDetails?.startTime, event.enquiryDetails?.status),
      }))
      setEvents(formattedEvents)
    })
  }, [])


  useEffect(() => {
    getEvents(c?.id);
    getBlockedDates(c?.id);
  }, [c?.id, getEvents, getBlockedDates])

  const renderSidebar = () => {
    return (
      <div className='demo-app-sidebar' style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px 0 15px' }}>
        <div className='demo-app-sidebar-section' style={{ display: 'flex', alignItems: 'center', height: '30px'}}>
          <Button onClick={() => navigate('/celebrity-details')} color='error' title='Back'><ArrowBackIcon /></Button>
          <h4 style={{ marginBottom: '0' }}>Available Events : <span style={{ color: 'red' }}>{events.length}</span></h4>
        </div>
        <div className='demo-app-sidebar-section' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <h2>{celebrity?.name}</h2>
          <ul style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '20rem' }}>
            <li>Completed Events</li>
            <li>Upcoming Events</li>
          </ul>
        </div>
      </div>
    )
  }

  const getEventStatus = (startTime, status) => {
    if (startTime < new Date().getTime()) {
      return "COMPLETED"
    } else if (status === "ACCEPTED") {
      return "ACCEPTED"
    } else {
      return "REJECTED"
    }
  }

  const getEventColor = (start, status) => {
    if ((new Date(start) < new Date()) || status === 'REJECTED') {
      return '#ff1a1a'
    } else {
      return '#0d6efd'
    }
  }
   
  const handleEventClick = (clickInfo) => {
    let event = clickInfo.event.toPlainObject();
    if (event.extendedProps?.status === 'REJECTED') {
      toast.error(`This event is Rejected`)
    } else if(event.extendedProps?.status === 'COMPLETED'){
      toast.info("This event is Completed!!!")
    } else {
      setSelectedEvent(event);
      setOpen(true);
    }
  }

  const handleCancelEvent = (scheduleId) => {
    axiosInstance.post(`/schedule/status/${scheduleId}`).then(() => {
      setOpen(false);
      toast.success("Event Cancelled");
      getEvents(celebrity?.id);
    })
  }

  const handleDateClick = (args) => {
    console.log(args, "handleDateClick")
    console.log(blockedDates, "blockedDates")
    console.log(_.filter(blockedDates, (blocked => blocked.blockedDate === args.start)), "filter");
    setBlockDates(args);
    setOpenBlockDate(true);
  }

  const handleBlockDate = (from, to) => {
    const blockObj = {};
    blockObj['celebrityId'] = celebrity?.id;
    blockObj['blockedDate'] = from;
    axiosInstance.post(`/block-date`, blockObj).then((response) => {
      getBlockedDates(celebrity?.id)
      setOpenBlockDate(false);
      toast.success(response?.message);
    })
  }

  const toolTipFunction = (info) => {
    let event = info.event?.toPlainObject();
    new Tooltip(info.el, {
      title: `${event?.title} - ${moment(event?.start).calendar()}`,
      placement: 'top',
      trigger: 'hover',
      container: 'body'
    })
  }

  return (
    <>
      {loading ? WATCH :
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
            aspectRatio={2}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
            weekends={weekEndAvailability}
            selectable={true}
            events={events}
            selectAllow={(event) => event.start < new Date() ? false : true}
            select={(event) => handleDateClick(event)}
            eventDidMount={toolTipFunction}
            dayMaxEvents={false}
            eventClick={(event) => handleEventClick(event)}
            eventDisplay="list-item"
            eventMouseEnter={(event) => (event.el.style.cursor = 'pointer')}
          />
          {open && selectedEvent.extendedProps.status === 'ACCEPTED' ? <CalendarModal open={open} handleClose={handleClose} handleOpen={handleOpen} event={selectedEvent} handleCancelEvent={handleCancelEvent} /> : " "}
          {openBlockDate && <BlockDatesModal open={openBlockDate} handleClose={handleBlockDatesClose} handleOpen={handleBlockDatesOpen} handleBlockDate={handleBlockDate} blockDates={blockDates} />}
        </>}
    </>
  )
}

export default Calendar
