import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { AddCelebrityDetails } from "./components/AddCelebrityDetails";
import { AdminLogin } from "./components/AdminLogin";
import Calendar from "./components/Calendar";
import CelebrityDetails from "./components/CelebrityDetails";
import CelebrityProfile from "./components/CelebrityProfile";
import { ClientForm } from "./components/ClientForm";
import EnquiryDetails from "./components/EnquiryDetails";
import { Processing } from "./components/Processing";
import Layout from "./util/Layout";
import AddTopics from "./components/AddTopics";
import AdminCalendar from "./components/AdminCalendar";
import AddAdmin from "./components/AddAdmin";
import PageNotFound from "./common/PageNotFound";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/book-now" element={<CelebrityDetails />} />
        <Route path="/client" element={<ClientForm />} />
        <Route element={<Layout />}>
          <Route path="/enquiry-details" element={<EnquiryDetails />} />
          <Route path="/celebrity-details" element={<CelebrityDetails />} />
          <Route path="/event-details" element={<Calendar />} />
          <Route path="/add-celebrity-details" element={<AddCelebrityDetails />} />
          <Route path="/celebrity-profile/:id" element={<CelebrityProfile />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/topics" element={<AddTopics />} />
          <Route path="/admin-calendar" element={<AdminCalendar />} />
          <Route path="/admin-enquiry" element={ <ClientForm /> } />
          <Route path="/add-admin" element={ <AddAdmin /> } />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={1000} />
    </>
  );
}

export default App;
