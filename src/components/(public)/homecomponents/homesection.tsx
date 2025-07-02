"use client"  
import React from 'react'
import FestivalInfo from './modules/welcome-section'
import Carousel from './modules/carousel'
import Schedule from './modules/schedule'
import Speakers from './modules/speakers'
import Testimonials from './modules/testimonials'
import GallerySection from './modules/gallery-section'
import Attendeessay from './modules/attendeessay'
import Blogs from './modules/blogs'
import Contactsection from './modules/contact-section'

export default function Homesection() {
  return (
    <div>
       <FestivalInfo />
      <Carousel/>
      <Schedule/>
      <Speakers/>
      <Testimonials/>
      <GallerySection/>
      <Attendeessay/>
      <Blogs/>
      <Contactsection/>
    </div>
  )
}
