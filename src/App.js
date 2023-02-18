import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AddCelebrityDetails } from './components/AddCelebrityDetails';
import { AdminLogin } from './components/AdminLogin';
import Calendar from './components/Calendar';
import { CelebrityDetails } from './components/CelebrityDetails';
import { ClientForm } from './components/ClientForm';
import TestingCalendar from './components/TestingCalendar';

function App() {
  return (
    <div >
      <Routes>
        <Route path='/' element={<AdminLogin />}></Route>
        <Route path='/enquiry-details' element={<TestingCalendar />}></Route>
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
