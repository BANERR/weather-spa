"use client";

import HomePage from "@/pages/homePage/homePage";

import { useEffect } from "react";

import getWeatherInCity from '@/assets/api'

export default function Home() {

  useEffect(()=>{
    // getWeatherInCity('London')
  },[])

  return (
    <HomePage/>
  );
}
