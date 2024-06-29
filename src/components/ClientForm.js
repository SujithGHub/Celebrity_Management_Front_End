import React, { useEffect, useState } from "react";
import loader from '../assets/handshake.gif';
import axiosInstance from "../util/Interceptor";
import { StepperForm } from "../util/StepperForm";
import _ from "lodash";
import { getToken } from "../util/Validation";

export const ClientForm = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enquiryDetails, setCelebrityDetails] = useState(null);
  const [selectedCelebrities, setSelectedCelebrities] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wait, setWait] = useState(false);
  const [accordianExpanded, setAccordianExpanded] = useState(false)

  useEffect(() => {
    getAllCelebrities();
    getTopics();
    getCategories();
  }, []);

  const getAllCelebrities = () => {
    axiosInstance.get(`/celebrity/get-all-celebrity`).then((res) => {
      let result = _.orderBy(res, "name");
      setCelebrities(result)
    });
  };


  const getTopics = () => {
    axiosInstance.get(`/topics/get-all-topic`).then(res => {
      setTopics(res)
    }).catch(()=> {})
  }

  const getCategories = () => {
    axiosInstance.get(`/category/get-all-category`).then(res => {
      setCategories(res)
    }).catch(() => {})
  }

  const handleClear = (key) => {
    if (key === "topics") {
      setSelectedTopics([])
    }
    setSelectedCelebrities([])
    setCelebrityDetails({...enquiryDetails, [key] : []})
  }

  const handleCelebrityChange = (event, keyName) => {
    const newValue = event.target.value
    const selectedIds = typeof newValue === "string" ? newValue.split(",") : newValue;
    if (selectedIds.length <= 3 && keyName === "celebrityIds") {
        setSelectedCelebrities(selectedIds)
        setCelebrityDetails({...enquiryDetails, [keyName] : selectedIds})
    } else if (keyName === "topics" && selectedIds.length <= 1) {
      setSelectedTopics(selectedIds);
      setCelebrityDetails({...enquiryDetails, [keyName] : selectedIds})
    }
  };

  const toggleAccordian = () => {
    setAccordianExpanded(prev => !prev)
  }

  const getCelebrityBasedOnFilter = (category={}, topic=[]) => {
    const categoryId = category?.id || "" 
    const topicId = topic[0]?.id || ""
    setAccordianExpanded(!accordianExpanded)
    setSelectedCelebrities([]);
    axiosInstance.get(`/celebrity/get/category-and-topic?categoryId=${categoryId}&topicId=${topicId}`).then((res) => {
      const activeCelebrities = res.filter(celebrity => celebrity.status === "ACTIVE")
      if(activeCelebrities.length === 1) {
        setSelectedCelebrities(activeCelebrities)
      }
      setCelebrities(activeCelebrities);
    }).catch(() => {

    })
  }

  const handleSubmit = (e) => {
    setWait(true)
    e.preventDefault();
    axiosInstance.post(`/enquiry`, enquiryDetails).then(res => {
      setLoading(true);
      setWait(false)
    }).catch(() => {
      setWait(false)
    })
  };

  return (
    <>
      {loading ?
        <div className='client-img'>
          <h2>Thanks for submitting enquiry!!! We will get back soon<a href={getToken() ? "/admin-enquiry" : "/client"} target="" style={{ textDecoration:'none', paddingLeft: '1rem'}}>Click here</a></h2>
          <img src={loader} alt="Computer man" />
        </div>
        :
        <>
          <div className="enquiry" >
              <StepperForm 
                  handleSubmit={handleSubmit} 
                  enquiryDetails={enquiryDetails}
                  celebrities={celebrities} 
                  setCelebrityDetails={setCelebrityDetails} 
                  getCelebrityBasedOnFilter={getCelebrityBasedOnFilter}
                  handleCelebrityChange={handleCelebrityChange} 
                  selectedCelebrities={selectedCelebrities}
                  handleClear={handleClear}
                  topics={topics}
                  selectedTopics={selectedTopics}
                  categories={categories}
                  wait={wait}
                  accordianExpanded={accordianExpanded}
                  toggleAccordian={toggleAccordian}
              />
            <div style={{margin: 'auto', width: '70%', paddingTop: '2rem'}}>
            </div>
          </div>
        </>}
    </>
  );
};