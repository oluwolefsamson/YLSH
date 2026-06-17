import React from 'react'
import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import HomeHero from '@/components/home/hero'
import HomeStats from '@/components/home/stats'
import HomePopularCourse from '@/components/home/popular-courses'
import HomeFeature from '@/components/home/feature'
import HomeTestimonial from '@/components/home/testimonial'
import HomeOurMentors from '@/components/home/mentors'
import HomeGallery from '@/components/home/gallery'
import HomePartners from '@/components/home/partners'
import HomeNewsLetter from '@/components/home/newsletter'

const Home: NextPageWithLayout = () => (
  <>
    <HomeHero />
    <HomeStats />
    <HomePopularCourse />
    <HomeFeature />
    <HomeTestimonial />
    <HomeOurMentors />
    <HomeGallery />
    <HomePartners />
    <HomeNewsLetter />
  </>
)

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default Home
