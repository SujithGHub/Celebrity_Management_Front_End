import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Tooltip } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function CelebrityProfile() {

  const location = useLocation();
  const navigate = useNavigate();

  const { celebrity } = location?.state;
  console.log(location,"location");

  const keysToExtract = ['name','mailId', 'phoneNumber', 'gender', 'dateOfBirth', 'categories','address', 'description']

  const filteredObject = Object.entries(celebrity).filter(([ key ]) => keysToExtract.includes(key)).reduce((obj, [key,value]) => {
    if (key === 'dateOfBirth') return {...obj, dateOfBirth: moment(value).format("DD-MM-yyyy")}
    if (key === 'gender') return {...obj, gender: value.toUpperCase()}
    if (key === 'categories') {
      const categoryNames = value.map(cat => cat.name); // Extracting only the 'name' property from each category
      return { ...obj, categories: categoryNames.join(",") };
    }
    obj[key] = value
    return obj;
  }, {})
  return (
    <div style={{ paddingLeft: '30px',paddingRight:'30px', display: 'flex' }}>
      <div>
      <div style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-start', marginBottom: '5px'}}>
        <Button onClick={() => navigate("/celebrity-details")} color='error' title="Back"><ArrowBackIcon /></Button>
        </div>
        <img width={350} height={500} alt={celebrity?.name} src={`data:image/jpeg/png;base64,${celebrity?.base64Image}`}></img>
      </div>
      <div className='table-body'>
        <div className='profile-edit'>
          <h3>{celebrity?.name}'s Profile</h3>
          <Tooltip title='Edit'>
            <Button variant="text" onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrity } })}>
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