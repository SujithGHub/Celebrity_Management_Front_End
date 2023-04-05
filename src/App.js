import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AddCelebrityDetails } from './components/AddCelebrityDetails';
import { AdminLogin } from './components/AdminLogin';
import Calendar from './components/Calendar';
import CelebrityDetails from './components/CelebrityDetails';
import CelebrityProfile from './components/CelebrityProfile';
import { ClientForm } from './components/ClientForm';
import EnquiryDetails from './components/EnquiryDetails';
import { Processing } from './components/Processing';
import Header from './util/Header';

function App() {
  
  return (
    <div >
      <Routes>
        <Route path='/' element={<AdminLogin />}></Route>
        <Route path="/enquiry-details" element={ <PrivateRoute><EnquiryDetails /></PrivateRoute> } />
        <Route path="/celebrity-details" element= {<><Header/><CelebrityDetails /></>} />
        <Route path="/event-details" element={ <PrivateRoute><Calendar /></PrivateRoute> } />
        <Route path="/add-celebrity-details" element={ <PrivateRoute><AddCelebrityDetails /></PrivateRoute> } />
        <Route path="/celebrity-profile" element={ <PrivateRoute><CelebrityProfile /></PrivateRoute> } />
        <Route path="/processing" element={ <PrivateRoute><Processing /></PrivateRoute> } />
        <Route path="/client" element= {<><Header/><ClientForm /></>} />
      </Routes>
        <ToastContainer autoClose={1000}/>
    </div>
  );
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth ? <><Header/>{children}</> : <Navigate to="/" />;
}

function useAuth() {
  return localStorage.getItem('token');
}

export default App;
