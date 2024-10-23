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
        title="invideo ai 1080 Revolutionize Your Shipping Routes"
        subtitle="Your Video Subtitle"
        description="Your video description goes here."
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
