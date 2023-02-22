import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AddCelebrityDetails } from './components/AddCelebrityDetails';
import { AdminLogin } from './components/AdminLogin';
import Calendar from './components/Calendar';
import { CelebrityDetails } from './components/CelebrityDetails';
import { ClientForm } from './components/ClientForm';
import EnquiryDetails from './components/EnquiryDetails';
import Header from './util/Header';

function App() {
  return (
    <div >
      <Header />
      <Routes>
        <Route path='/' element={<AdminLogin />}></Route>
        <Route path='/enquiry-details' element={<EnquiryDetails />}></Route>
        <Route path='/celebrity-details' element={<CelebrityDetails />}></Route>
        <Route path='/add-celebrity-details' element={<AddCelebrityDetails />} />
        <Route path='/client' element={<ClientForm />} />
        <Route path='/event-details' element={<Calendar />} />
      </Routes>
        <ToastContainer />
    </div>
  );
}

export default App;
