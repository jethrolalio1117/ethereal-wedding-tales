
import Layout from "@/components/Layout";
import HomeSection from "@/components/sections/HomeSection";
import StorySection from "@/components/sections/StorySection";
import GallerySection from "@/components/sections/GallerySection";
import RSVPSection from "@/components/sections/RSVPSection";

const Index = () => (
  <Layout>
    <div className="min-h-screen">
      <HomeSection />
      <StorySection />
      <GallerySection />
      <RSVPSection />
    </div>
  </Layout>
);

export default Index;
