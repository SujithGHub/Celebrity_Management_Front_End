import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from "react";
import axiosInstance from '../util/Interceptor'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/Admin.css';
import _ from 'lodash';

const AdminCalendar = () => {

    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        getScheduledEvents();
    }, []);

    const getEventStatus = (event) => {
      console.log(event, "event")
      const { startTime, status } = event
      if (startTime < new Date().getTime()) {
        return "COMPLETED"
      } else if (status === "ACCEPTED") {
        return "ACCEPTED"
      } else {
        return "REJECTED"
      }
    }

    const getScheduledEvents = () => {
      axiosInstance.get("/schedule/get-all-schedule").then((res) => {
        const allSchedule = res;
        const scheduledEvents = _.map(allSchedule, (schedule, key) => ({
          scheduleId: schedule?.id,
          enquiryId: schedule?.enquiryDetails?.id,
          organizationName: schedule?.enquiryDetails?.organizationName,
          organizerName: schedule?.enquiryDetails?.name,
          email: schedule?.enquiryDetails?.mailId,
          venue: schedule?.enquiryDetails?.venue,
          mobile: schedule?.enquiryDetails?.phoneNumber,
          title: schedule?.enquiryDetails?.eventName ? schedule?.enquiryDetails?.eventName : "No Event Name Available!!!",
          start: schedule?.enquiryDetails?.startTime || "Not Available!!!",
          end: schedule?.enquiryDetails?.endTime,
          status: getEventStatus(schedule?.enquiryDetails),
          celebrityId: schedule?.enquiryDetails?.celebrity?.id,
          celebrityName: schedule?.enquiryDetails?.celebrity?.name,
          celebrityEmail: schedule?.enquiryDetails?.celebrity?.mailId,
          celebrityMobile: schedule?.enquiryDetails?.celebrity?.phoneNumber,
          celebrityStatus: schedule?.enquiryDetails?.celebrity?.status,
          color: "#0d6efd",
          display: "block",
        }));
        console.log(scheduledEvents, "scheduledEvents")
        setSchedule(scheduledEvents);
        return scheduledEvents;
      });
    };


    const handleEventContent = (arg) => {
      let extProps = arg.event.toPlainObject();
      const { status } = extProps.extendedProps
      extProps = extProps.title;
      const getStyles = (status) => {
        console.log(status, "status");
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

  return (
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
        ]}
        headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
        events={schedule}
        eventContent={handleEventContent} //For modifying event display style
        stickyHeaderDates
        aspectRatio={2}
        themeSystem="bootstrap5"
        eventMaxStack={3}
        eventMouseEnter={(event) => (event.el.style.cursor = 'pointer')}
      />
  );
};

export default AdminCalendar;
