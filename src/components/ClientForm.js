import React, { useEffect, useState } from "react";
import loader from '../assets/handshake.gif';
import axiosInstance from "../util/Interceptor";
import { StepperForm } from "../util/StepperForm";

export const ClientForm = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [celebrityDetails, setCelebrityDetails] = useState(null);
  const [selectedCelebrities, setSelectedCelebrities] = useState([]);  // To store IDs
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    getAllCelebrity();
    getTopics();
    getCategories();
  }, []);

  const getTopics = () => {
    axiosInstance.get(`/topics/get-all-topic`).then(res => {
      setTopics(res)
    })
  }

  const getCategories = () => {
    axiosInstance.get(`/category/get-all-category`).then(res => {
      setCategories(res)
    })
  }

  const handleCelebrityChange = (event, keyName) => {
    console.log(keyName, "keyName");
    const newValue = event.target.value
    const selectedIds = typeof newValue === "string" ? newValue.split(",") : newValue;
    if (selectedIds.length <= 3) {
      keyName === "celebrityIds"
        ? setSelectedCelebrities(selectedIds)
        : setSelectedTopics(selectedIds);
      setCelebrityDetails({...celebrityDetails, [keyName] : selectedIds})
    }
  };

  const getAllCelebrity = () => {
    axiosInstance.get(`/celebrity/get-all-celebrity`).then((res) => {
      const activeCelebrities = res.filter(celebrity => celebrity.status === "ACTIVE")
      setCelebrities(activeCelebrities);
    })
  }

  const handleSubmit = (e) => {
    setWait(true)
    e.preventDefault();
    axiosInstance.post(`/enquiry`, celebrityDetails).then(res => {
      setLoading(true);
      setWait(false)
    })
  };

  return (
    <>
      {loading ?
        <div className='client-img'>
          <h2>Thanks for submitting enquiry!!! We will get back soon<a href="/celebrity-details" style={{ textDecoration:'none', paddingLeft: '1rem'}}>Click here</a></h2>
          <img src={loader} alt="Computer man" />
        </div>
        :
        <>
          <div className="enquiry" >
              <StepperForm 
                  handleSubmit={handleSubmit} 
                  celebrityDetails={celebrityDetails}
                  celebrities={celebrities} 
                  setCelebrityDetails={setCelebrityDetails} 
                  handleCelebrityChange={handleCelebrityChange} 
                  selectedCelebrities={selectedCelebrities} 
                  topics={topics}
                  selectedTopics={selectedTopics}
                  categories={categories}
                  wait={wait}
              />
            <div style={{margin: 'auto', width: '70%', paddingTop: '2rem'}}>
            </div>
          </div>
        </>}
    </>
  );
};