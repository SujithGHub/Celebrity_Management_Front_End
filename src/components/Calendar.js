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
import { BlockDatesModal, CalendarModal, UnBlockModal } from '../util/CalendarModal';
import axiosInstance from '../util/Interceptor';
import { WATCH } from '../util/Loader';
import SnackBar from '../util/SnackBar';

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
  const [openUnBlockDate, setOpenUnBlockDate] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading,] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [snackInfo, setSnackInfo] = useState(null);
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleSnackOpen = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlockDatesOpen = () => setOpenBlockDate(true);
  const handleBlockDatesClose = () => setOpenBlockDate(false);

  const handleUnBlockDatesOpen = () => setOpenUnBlockDate(true);
  const handleUnBlockDatesClose = () => setOpenUnBlockDate(false);

  const getBlockedDates = useCallback((celebrityId) => {
    axiosInstance.get(`/block-date/getByCelebrityId/${celebrityId}`).then(response => {
      setBlockedDates(response);
    })
  }, [])

  const getEventTitle = (event) => event.enquiryDetails ? event.enquiryDetails.eventName : "Date is Blocked"
  const getEventStart = (event) => {
    if (event?.enquiryDetails) {
      return event?.enquiryDetails?.startTime
    } else {
      return event?.blockedDate
    }
  }

  const getEventEnd = (event) => {
    const blockedTo = moment(event?.blockedDate).set({ hour: 23, minute: 59, second: 0 });
    if (event?.enquiryDetails) {
      return event?.enquiryDetails?.endTime
    } else {
      return new Date(blockedTo).getTime()
    }
  }

  const getEvents = (id) => {
    axiosInstance.get(`/schedule/celebrity-id/${id}`).then(response => {
      setAllEvents(response);
      const combinedEvents = response.concat(blockedDates)
      const formattedEvents = _.map(combinedEvents, (event, key) => ({
        id: event?.id,
        title: getEventTitle(event),
        start: getEventStart(event),
        end: getEventEnd(event),
        location: event.enquiryDetails ? event.enquiryDetails?.location : 'un_available',
        phoneNumber: event.enquiryDetails ? event.enquiryDetails?.phoneNumber : 'un_available',
        organizerName: event.enquiryDetails ? event.enquiryDetails?.name : 'un_available',
        organizationName: event.enquiryDetails ? event.enquiryDetails?.organizationName : 'un_available',
        status: event.enquiryDetails ? getEventStatus(event) : 'BLOCKED',
        color: event.enquiryDetails ? getEventColor(event) : '#ef5050',
        display: event.enquiryDetails ? 'list-item' : 'block'
      }))
      setEvents(formattedEvents)
    })
  }

  useEffect(() => {
    axiosInstance.get(`/block-date/getByCelebrityId/${c?.id}`).then(response => {
      setBlockedDates(response);
    })
  }, [c?.id])

  useEffect(() => {
    c?.id && getEvents(c?.id)
    // eslint-disable-next-line
  }, [blockedDates])

  const renderSidebar = () => {
    return (
      <div className='demo-app-sidebar' style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 15px 5px 15px' }}>
        <div className='demo-app-sidebar-section' style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', height: '30px' }}>
          <Button onClick={() => navigate('/celebrity-details')} color='error' title='Back'><ArrowBackIcon /></Button>
          <ul style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '1.5rem' }}>
            <li>Completed Events</li>
            <li>Pending Events</li>
            <li>Blocked Dates</li>
          </ul>
          {/* <h6 style={{ marginBottom: '0' }}>Completed Events in {currentMonth} : <span style={{ color: 'red' }}>{completedCount(events,currentMonth)}</span></h6>
          <h6 style={{ marginBottom: '0' }}>Pending Events in {currentMonth} : <span style={{ color: '#0d6efd' }}>{getEventCount(events,currentMonth)}</span></h6> */}
        </div>
        <div className='demo-app-sidebar-section' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <h2>{celebrity?.name}</h2>
          <ul>
            <li>Completed Events in {currentMonth} : <span style={{ color: 'red' }}>{completedCount(events, currentMonth)}</span></li>
            <li>Pending Events in {currentMonth} : <span style={{ color: '#0d6efd' }}>{getEventCount(events, currentMonth)}</span></li>
          </ul>
        </div>
      </div>
    )
  }

  const getEventStatus = (event) => {
    const { startTime, status } = event.enquiryDetails
    if (startTime < new Date().getTime()) {
      return "COMPLETED"
    } else if (status === "ACCEPTED") {
      return "ACCEPTED"
    } else {
      return "REJECTED"
    }
  }

  const getEventColor = (event) => {
    const { startTime, status } = event.enquiryDetails
    if ((new Date(startTime) < new Date()) || status === 'REJECTED') {
      return '#ff1a1a'
    } else {
      return '#0d6efd'
    }
  }

  const handleEventClick = (clickInfo) => {
    let event = clickInfo.event.toPlainObject();
    let { status } = event.extendedProps
    if (status === 'REJECTED') {
      setSnackInfo(event);
      setOpenSnack(true);
    } else if (status === 'COMPLETED') {
      setSnackInfo(event);
      setOpenSnack(true);
    } else if (status === 'BLOCKED') {
      setSnackInfo(event);
      setOpenSnack(true);
    } else {
      setSelectedEvent(event);
      setOpen(true);
    }
  }

  const handleCancelEvent = (scheduleId) => {
    axiosInstance.post(`/schedule/status/${scheduleId}`).then(() => {
      setOpen(false);
      toast.success("Event Cancelled");
      getBlockedDates(celebrity?.id);
    })
  }

  // function for Not allowing user to block date if an event is available;
  const handleDateClick = (info) => {
    const infoDate = new Date(info.start).getDate();
    const infoMonth = new Date(info.start).getMonth();
    const filter = events.filter(event => {
      let eventDate = new Date(event.start).getDate()
      let eventMonth = new Date(event.start).getMonth()
      if (infoDate === eventDate && infoMonth === eventMonth) {
        return event;
      }
      return null
    })
    if (_.size(filter) > 0) {
      const accFilter = _.filter(filter, fil => fil.status === 'ACCEPTED')
      const rejFilter = _.filter(filter, fil => fil.status === 'REJECTED')
      const blkFilter = _.filter(filter, fil => fil.status === 'BLOCKED')
      if (accFilter.length > 0) {
        setSnackInfo(accFilter)
        setOpenSnack(true)
      } if (rejFilter.length > 0 && accFilter.length === 0 && blkFilter.length === 0) {
        setBlockDates(info)
        setOpenBlockDate(true)
      } if (blkFilter.length > 0 && accFilter.length === 0) {
        setBlockDates(blkFilter)
        setOpenUnBlockDate(true)
      }
    } else {
      setBlockDates(info)
      setOpenBlockDate(true)
    }
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

  const handleUnBlockDate = (id) => {
    axiosInstance.delete(`/block-date/delete-by-id/${id}`).then(response => {
      getBlockedDates(celebrity?.id)
      setOpenUnBlockDate(false);
      toast.success(response?.message)
    })
  }

  const toolTipFunction = (info) => {
    let event = info.event?.toPlainObject();
    new Tooltip(info.el, {
      title: `${event?.title} - ${moment(event?.start).calendar()}`,
      placement: 'top',
      trigger: 'hover',
      container: 'body',
      delay: 300
    })
  }

  const handleEventContent = (arg) => {
    const start = arg.event.toPlainObject();
    const startTime = moment(start.start).format('hh:mm');
    const status = start.extendedProps?.status

    const getStyles = (status) => status === 'COMPLETED' ? 'event-display completed' : status === 'ACCEPTED' ? 'event-display accepted' : 'event-display blocked'

    return (
      <div className={getStyles(status)}>
        <ul>
          <li style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {status === 'BLOCKED' ? '' : startTime}&nbsp;{arg.event.title}
          </li>
        </ul>
      </div>
    );
  };

  const getEventCount = (events, month) => {
    const filtered = events?.filter((event) => moment(event.start).format("MMMM") === month);
    const showCount = filtered?.filter((fil) => fil?.status === "ACCEPTED");
    return showCount?.length;
  };

  const completedCount = (events, month) => {
    const filtered = events?.filter((event) => moment(event.start).format("MMMM") === month);
    const showCount = filtered?.filter((fil) => fil?.status === "COMPLETED");
    return showCount?.length;
  }

  const handleDatesSet = (info) => {
    if (info.view.type === 'dayGridMonth') {
      const newMonth = new Date(info.view.currentStart).toLocaleString('default', { month: 'long' });
      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth);
        // console.log(`Month changed to ${newMonth}`);
      }
    }
  };

  return (
    <>
      {openSnack && <SnackBar open={openSnack} handleSnackOpen={handleSnackOpen} handleSnackClose={handleSnackClose} event={snackInfo} />}
      {loading ? WATCH :
        <div style={{ paddingTop: '60px' }}>
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
            eventContent={handleEventContent} //For modifying event display style
            datesSet={handleDatesSet}  //For getting current month
            selectAllow={(event) => event.start < new Date() ? false : true} // Where the select should be allowed
            select={handleDateClick} // For clicking on date area to block date
            eventDidMount={toolTipFunction} // For event hover effect to display event time
            dayMaxEvents={2}
            eventClick={(event) => handleEventClick(event)} // For clicking event to show modal
            eventDisplay="list-item"
            eventMouseEnter={(event) => (event.el.style.cursor = 'pointer')}
          />
          {open && selectedEvent.extendedProps.status === 'ACCEPTED' ? <CalendarModal open={open} handleClose={handleClose} handleOpen={handleOpen} event={selectedEvent} handleCancelEvent={handleCancelEvent} /> : " "}
          {openBlockDate && <BlockDatesModal open={openBlockDate} handleClose={handleBlockDatesClose} handleOpen={handleBlockDatesOpen} handleBlockDate={handleBlockDate} blockDates={blockDates} />}
          {openUnBlockDate && <UnBlockModal open={openUnBlockDate} handleClose={handleUnBlockDatesClose} handleOpen={handleUnBlockDatesOpen} unBlockDate={blockDates} handleUnBlockDate={handleUnBlockDate} />}
        </div>}
    </>
  )
}

export default Calendar