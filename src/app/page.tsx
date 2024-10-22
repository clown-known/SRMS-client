// pages/index.tsx

'use client';

import Footer from '@/components/Footer';
import HomeSlider from '@/components/SlideContent';
import YouTubeVideo from '@/components/YouTubeVideo';

export default function Home() {
  return (
    <div>
      <HomeSlider />
      {/* <YouTubeVideo videoId="lqAU0wQIbZE" title="Your Video Title" /> */}
      <YouTubeVideo
        videoId="lqAU0wQIbZE"
        title="Your Video Title"
        subtitle="Your Video Subtitle"
        description="Your video description goes here."
      />
      <Footer />
    </div>
  );
}
