import React from 'react'
import { CirclesWithBar } from "react-loader-spinner";

function Loader() {

  return (
    <CirclesWithBar
      color="#4fa94d"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      outerCircleColor=""
      innerCircleColor=""
      barColor=""
      ariaLabel='circles-with-bar-loading'
    />
  )
}

export default Loader