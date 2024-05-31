import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import { Tooltip } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from "react";
import '../css/Admin.css';
import axiosInstance from '../util/Interceptor';
import { CalendarModal } from '../util/CalendarModal';

const AdminCalendar = () => {

    const calendarRef = useRef(null);

    const [schedule, setSchedule] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState([]);

    useEffect(() => {
        getScheduledEvents();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getEventStatus = (event) => {
      const { startTime, status } = event
      if (startTime < new Date().getTime()) {
        return "COMPLETED"
      } else if (status === "ACCEPTED") {
        return "ACCEPTED"
      } else {
        return "REJECTED"
      }
    }

    const getEventDisplayStyle = (event) => {
      const { status, startTime } = event
      return (startTime < new Date().getTime() || status === "REJECTED") ? "list-item" : "block"
    }

    const getEventColor = (event) => {
      const { status } = event;
      return status === "ACCEPTED" ? '#FFFF' : status === "REJECTED" ? "red" : "green"
    }

    const getEventCount = (events, month, status) => {
      const filtered = events?.filter((event) => moment(event.start).format("MMMM") === month);
      const showCount = filtered?.filter((fil) => fil?.status === status);
      return showCount?.length;
    };
  
    const renderSidebar = () => {
      return (
        <div className='demo-app-sidebar' style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 15px 5px 15px' }}>
          <div className='demo-app-sidebar-section' style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', height: '30px' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '1.5rem' }}>
              <li>Completed Events</li>
              <li>Pending Events</li>
              <li>Blocked Dates</li>
            </ul>
          </div>
          <div className='demo-app-sidebar-section' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <ul>
              <li>Pending Events in {currentMonth} : <span style={{ color: '#0d6efd' }}>{getEventCount(schedule, currentMonth, "ACCEPTED")}</span></li>
              <li>Rejected Events in {currentMonth} : <span style={{ color: 'red' }}>{getEventCount(schedule, currentMonth, "REJECTED")}</span></li>
              <li>Completed Events in {currentMonth} : <span style={{ color: 'red' }}>{getEventCount(schedule, currentMonth, "COMPLETED")}</span></li>
            </ul>
          </div>
        </div>
      )
    }

    const getScheduledEvents = () => {
      axiosInstance.get("/schedule/get-all-schedule").then((res) => {
        const allSchedule = res;
        const scheduledEvents = allSchedule && _.map(allSchedule, (schedule, key) => ({
          scheduleId: schedule.id,
          enquiryId: schedule.enquiryDetails.id,
          organizationName: schedule.enquiryDetails.organizationName,
          organizerName: schedule.enquiryDetails.name,
          email: schedule.enquiryDetails.mailId,
          venue: schedule.enquiryDetails.venue,
          mobile: schedule.enquiryDetails.phoneNumber,
          title: schedule.enquiryDetails.eventName ? schedule.enquiryDetails.eventName : "No Event Name Available!!!",
          start: schedule.enquiryDetails.startTime || "Not Available!!!",
          end: schedule.enquiryDetails.endTime,
          status: getEventStatus(schedule.enquiryDetails),
          celebrityId: schedule.enquiryDetails.celebrity.id,
          celebrityName: schedule.enquiryDetails.celebrity.name,
          celebrityEmail: schedule.enquiryDetails.celebrity.mailId,
          celebrityMobile: schedule.enquiryDetails.celebrity.phoneNumber,
          celebrityStatus: schedule.enquiryDetails.celebrity.status,
          color: getEventColor(schedule.enquiryDetails),
          display: getEventDisplayStyle(schedule.enquiryDetails),
        }));
        setSchedule(scheduledEvents);
      });
    };


    const handleEventContent = (arg) => {
      let extProps = arg.event.toPlainObject();
      const { status } = extProps.extendedProps
      extProps = extProps.title;
      
      const getStyles = (status) => {
       return status === 'COMPLETED' ? 'event-display completed' : status === 'ACCEPTED' ? 'event-display accepted' : 'event-display blocked'
      }
      return (
        <div className={getStyles(status)}>
          <ul>
            <li style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {extProps}
            </li>
          </ul>
        </div>
      );
    };

    const handleDatesSet = (info) => {
      if (info.view.type === 'dayGridMonth') {
        const newMonth = new Date(info.view.currentStart).toLocaleString('default', { month: 'long' });
        if (newMonth !== currentMonth) {
          setCurrentMonth(newMonth);
        }
      }
    };

    const toolTipFunction = (info) => {
      const { start , title } = info?.event?.toPlainObject()
      new Tooltip(info.el, {
        title: `${title} - ${moment(start).calendar()}`,
        placement: 'top',
        trigger: 'hover',
        container: 'body',
        delay: 300
      })
    }

    const handleSelectEvent = (event) => {
      const scheduleInfo = event?.event?.toPlainObject()
      // console.log(scheduleInfo.);
      setSelectedSchedule(scheduleInfo)
      setOpen(true)
    }

  return (
    <div>
      {renderSidebar()}
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
          listPlugin
        ]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        buttonText = {{
          today : "Today",
          month : "Month",
          day : "Day",
          week : "Week",
          list : "Agenda"
        }}
        ref={calendarRef}
        events={schedule}
        eventContent={handleEventContent} //For modifying event display style
        datesSet={handleDatesSet}  //For getting current month
        eventClick={(event) => handleSelectEvent(event)}
        stickyHeaderDates
        selectAllow={(event) => event.start < new Date() ? false : true}
        aspectRatio={2}
        eventMaxStack={3}
        dayMaxEvents={2}
        themeSystem="bootstrap5"
        eventMouseEnter={(event) => (event.el.style.cursor = "pointer")}
        eventDidMount={toolTipFunction}
        selectable={true}
      />
      <CalendarModal open={open} handleClose={handleClose} handleOpen={handleOpen} event={selectedSchedule} show={"scheduleInfo"}/>
    </div>
  );
};

export default AdminCalendar;
