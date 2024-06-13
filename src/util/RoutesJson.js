import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PanoramaIcon from '@mui/icons-material/Panorama';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TopicIcon from '@mui/icons-material/Topic';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const commonRoutes = {
    "Enquiry Details": {
        URL: '/enquiry-details',
        icon: <FormatListNumberedIcon sx={{ margin: '10px' }} />
    },
    "Schedule Details": {
        URL: '/processing',
        icon: <HourglassTopIcon sx={{ margin: '10px' }} />
    },
    "Celebrity Details": {
        URL: '/celebrity-details',
        icon: <PanoramaIcon sx={{ margin: '10px' }} />
    }
};

const adminRoutes = {
    "Admin": {
        icon: <AdminPanelSettingsIcon sx={{ margin: '10px' }} />,
        submenu: {
            "Event List": {
                URL: '/admin-calendar',
                icon: <CalendarMonthIcon sx={{ margin: '10px' }} />
            },
            "Add Event": {
                URL: '/admin-enquiry',
                icon: <EventAvailableIcon sx={{ margin: '10px' }} />
            }
        }
    }
};

const superAdminRoutes = {
    "Super Admin": {
        icon: <AdminPanelSettingsIcon sx={{ margin: '10px' }} />,
        submenu: {
            "Topics/Categories": {
                URL: "/topics",
                icon: <TopicIcon sx={{ margin: '10px' }} />
            },
            "Event List": {
                URL: '/admin-calendar',
                icon: <CalendarMonthIcon sx={{ margin: '10px' }} />
            },
            "Add Event": {
                URL: '/admin-enquiry',
                icon: <EventAvailableIcon sx={{ margin: '10px' }} />
            },
            "Add Celebrity": {
                URL: "/add-celebrity-details",
                icon: <PersonAddIcon sx={{ margin: '10px' }} />
            },
            "Add Admin": {
                URL: '/add-admin',
                icon: <GroupAddIcon sx={{ margin: '10px' }} />
            },
        }
    }
};

export const getRoutes = (role) => {
    let routes = { ...commonRoutes };

    if (role === 'ADMIN') {
        routes = { ...routes, ...adminRoutes };
    }

    if (role === 'SUPER_ADMIN') {
        routes = { ...routes, ...superAdminRoutes };
    }

    return routes;
};


