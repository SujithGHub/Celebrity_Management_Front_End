import React from 'react'
import { CirclesWithBar, Watch } from "react-loader-spinner";

export const CIRCLE_WITH_BAR = <CirclesWithBar
  color="#4fa94d"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  outerCircleColor=""
  innerCircleColor=""
  barColor=""
  ariaLabel='circles-with-bar-loading'
/>

export const WATCH =
  <Watch
    height="80"
    width="80"
    radius="48"
    color="#4fa94d"
    ariaLabel="watch-loading"
    wrapperStyle={{}}
    wrapperClassName=""
    visible={true}
  />