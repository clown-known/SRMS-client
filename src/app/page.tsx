// pages/index.tsx

'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import HomeSlider from '@/components/SlideContent';
import YouTubeVideo from '@/components/YouTubeVideo';
import Intro from '@/components/home/Intro';
import CoreGrid from '@/components/home/CoreGrid';
import GradientWrapper from '@/components/home/GradientWrapper';
import Features from '@/components/home/Features';
import CTA from '@/components/home/CTA';
import ToolKit from '@/components/home/ToolKit';
import Member from '@/components/home/Member';
import Start from '@/components/home/Start';
import CardSection from '@/components/home/CardSection';

export default function Home() {
  return (
    <div>
      <Intro />
      <CoreGrid />
      <YouTubeVideo
        videoId="vx5mXiOh5Ec"
        title="Take a look with our Context"
        subtitle="Simple Shipping Route Management System (SRMS)"
        description="    
This project develops towards a transnational shipping company, here, we have points (destination and departure points) as well as routes (paths between points). The system allows users to create accounts, create roles with specified permissions, and those with those permissions will only be able to do permitted actions. In addition, we send emails to users when there are changes to their accounts."
      />

      <GradientWrapper>
        <ToolKit />
        <Features />
        <HomeSlider />
      </GradientWrapper>
      <GradientWrapper>
        <Member />
      </GradientWrapper>

      <CardSection />
      <Footer />
    </div>
  );
}
