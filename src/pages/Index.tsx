import HomeSection from "@/components/sections/HomeSection";
import StorySection from "@/components/sections/StorySection";
import GallerySection from "@/components/sections/GallerySection";
import RSVPSection from "@/components/sections/RSVPSection";

const sections = [
  { id: "home", Component: HomeSection },
  { id: "story", Component: StorySection },
  { id: "gallery", Component: GallerySection },
  { id: "rsvp", Component: RSVPSection },
];

const Index = () => (
  <div className="min-h-screen">
    {sections.map(({ id, Component }, i) => (
      <section
        id={id}
        key={id}
        className={`scroll-mt-28 transition-opacity duration-700`}
      >
        <Component />
      </section>
    ))}
  </div>
);

export default Index;
