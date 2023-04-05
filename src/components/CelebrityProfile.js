import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Tooltip } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function CelebrityProfile() {

  const location = useLocation();
  const navigate = useNavigate();

  const { celebrity } = location.state;

  const keysToExtract = ['name','mailId', 'phoneNumber', 'gender', 'dateOfBirth', 'profession','address', 'description']

  console.log(celebrity)

  const filteredObject = Object.entries(celebrity).filter(([key, value]) => keysToExtract.includes(key)).reduce((obj, [key,value]) => {
    if (key === 'dateOfBirth') return {...obj, dateOfBirth: moment(value).format("DD-MM-yyyy")}
    if (key === 'gender') return {...obj, gender: value.toUpperCase()}
    obj[key] = value
    return obj;
  }, {})

  return (
    <div style={{ padding: '80px 30px', display: 'flex' }}>
      <div>
      <div style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-start', marginBottom: '10px'}}>
        <Button onClick={() => navigate("/celebrity-details")} color='error' title="Back"><ArrowBackIcon /></Button>
        {/* <h2>Celebrity Profile</h2> */}
        </div>
        <img width={350} height={500} alt={celebrity?.name} src={`data:image/jpeg/png;base64,${celebrity?.base64Image}`}></img>
      </div>
      <div className='table-body'>
        <div className='profile-edit'>
          <h2>{celebrity?.name}'s Profile</h2>
          <Tooltip title='Edit'>
            <Button variant="text" onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrity } })}>
              {/* <img src={EditIcon} style={{ marginRight: 0 }} alt="edit" width='30px' height='30px' /> */}
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