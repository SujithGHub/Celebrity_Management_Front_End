import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Tooltip } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../util/Interceptor';
import { getImagePath } from '../util/Validation';

const CelebrityProfile = () => {

  const { id } = useParams();

  const [celebrity, setCelebrity] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/celebrity/${id}`)
      .then((res) => setCelebrity(res));
  }, [id]);

  const keysToExtract = ['name','mailId', 'topics' ,'phoneNumber', 'gender', 'dateOfBirth', 'categories','location', 'description']

  const filteredObject = Object.entries(celebrity).filter(([ key ]) => keysToExtract.includes(key)).reduce((obj, [key,value]) => {
    if (key === 'dateOfBirth') return {...obj, dateOfBirth: moment(value).format("DD-MM-yyyy")}
    if (key === 'gender') return {...obj, gender: value.toUpperCase()}
    if (key === 'categories' || key === "topics") {
      const names = value.map(cat => cat.name);
      return { ...obj, [key]: names.join(",") };
    }
    obj[key] = value
    return obj;
  }, {})
  
  return (
    <div style={{ paddingLeft: '15px',paddingRight:'15px', display: 'flex' }}>
      <div>
      <div style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-start', marginBottom: '5px'}}>
        <Button onClick={() => navigate("/celebrity-details")} color='error' title="Back"><ArrowBackIcon /></Button>
        </div>
        <img width={350} height={500} alt={celebrity?.name} src={getImagePath(celebrity.image)}></img>
      </div>
      <div className='table-body'>
        <div className='profile-edit'>
          <h3>{celebrity?.name}'s Profile</h3>
          <Tooltip title='Edit'>
            <Button variant="text" onClick={() => navigate('/add-celebrity-details', { state: {celebrity: celebrity}})}>
              Edit Profile
            </Button>
          </Tooltip>
        </div>
        <table>
          <tbody>
            {Object.entries(filteredObject).map(([key, value]) => (
              <tr key={key}>
                <th>{key.toUpperCase()}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CelebrityProfile