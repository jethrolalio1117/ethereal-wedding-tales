
import { useState, useEffect } from 'react';

interface HomePageData {
  backgroundImage: string;
  coupleNames: string;
  weddingDate: string;
  ceremonyTime: string;
  venueName: string;
  venueAddress: string;
  loveStory: {
    firstSpark: string;
    adventures: string;
    proposal: string;
    nextChapter: string;
  };
}

const defaultData: HomePageData = {
  backgroundImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
  coupleNames: "Liam & Mia",
  weddingDate: "October 25th, 2025",
  ceremonyTime: "3:00 PM",
  venueName: "The Enchanted Gardens",
  venueAddress: "123 Dreamy Lane, Wonderland",
  loveStory: {
    firstSpark: "It all began on a crisp autumn evening, under a sky full of stars. We met at a small, cozy bookstore cafe, drawn together by a shared love for classic literature and strong coffee. What started as a simple conversation about our favorite authors soon blossomed into something much more profound. We talked for hours, lost in our own world, oblivious to the time passing by.",
    adventures: "From that day forward, our lives became an exciting adventure. We explored hidden city gems, hiked through breathtaking landscapes, and shared countless laugh-filled dinners. Each moment, whether big or small, wove another thread into the beautiful tapestry of our relationship. We discovered not just a partner in each other, but a best friend, a confidant, and a soulmate.",
    proposal: "On a serene beach, with the sun setting in a blaze of glory, painting the sky in hues of orange and purple, one of us got down on one knee. It was a moment suspended in time, filled with happy tears, heartfelt promises, and an overwhelming sense of joy. The answer was a resounding \"Yes!\" – a promise of forever.",
    nextChapter: "Now, we stand on the cusp of our greatest adventure yet – marriage. We are so excited to celebrate our love with all of you, our cherished family and friends. Your presence will make our special day even more memorable as we embark on this beautiful journey together, hand in hand, heart to heart."
  }
};

export const useHomePageData = () => {
  const [data, setData] = useState<HomePageData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('homePageData');
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error loading home page data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = (newData: HomePageData) => {
    setData(newData);
    localStorage.setItem('homePageData', JSON.stringify(newData));
  };

  return { data, updateData, loading };
};
