import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PanoramaIcon from '@mui/icons-material/Panorama';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TopicIcon from '@mui/icons-material/Topic';
export const Routes = {
    "Enquiry Details": {
      URL: '/enquiry-details',
      icon: <FormatListNumberedIcon sx={{margin:'10px'}}/>    
    },
    "Schedule Details": {
      URL: '/processing',
      icon: <HourglassTopIcon sx={{margin:'10px'}}/>
    },
    "Celebrity Details": {
      URL: '/celebrity-details',
      icon: <PanoramaIcon sx={{margin:'10px'}}/>
    },
    "Admin": {
        icon: <AdminPanelSettingsIcon sx={{margin:'10px'}}/>,
        "submenu": {
          "Add Celebrity": {
            "URL": "/add-celebrity-details",
            "icon": <PersonAddIcon sx={{margin:'10px'}}/>
          },"Add Topics": {
            "URL": "/topics",
            "icon": <TopicIcon sx={{margin:'10px'}}/>
          }
        }
      }
  };
  