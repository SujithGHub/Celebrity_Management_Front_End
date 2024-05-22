import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AddCelebrityDetails } from './components/AddCelebrityDetails';
import AddTopics from './components/AddTopics';
import { AdminLogin } from './components/AdminLogin';
import Calendar from './components/Calendar';
import CelebrityDetails from './components/CelebrityDetails';
import CelebrityProfile from './components/CelebrityProfile';
import { ClientForm } from './components/ClientForm';
import EnquiryDetails from './components/EnquiryDetails';
import { Processing } from './components/Processing';
import { CommonSideBar } from './util/CommonSideBar';
import Layout from './util/Layout';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location])


  return (
    <>
    <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/client" element={<><ClientForm /></>} />
          <Route element={<Layout />}>
            <Route path="/enquiry-details" element={<EnquiryDetails />} />
            <Route path="/celebrity-details" element={<><CelebrityDetails /></>} />
            <Route path="/event-details" element={<Calendar />} />
            <Route path="/add-celebrity-details" element={<AddCelebrityDetails />} />
            <Route path="/celebrity-profile" element={<CelebrityProfile />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/sidebar" element={<CommonSideBar />} />
            <Route path="/topics" element={<AddTopics />} />
          </Route>
      </Routes>
      <ToastContainer autoClose={1000} />
      </>
    );
  }

export default App;
