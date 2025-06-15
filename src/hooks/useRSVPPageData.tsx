
import { useState, useEffect } from 'react';

interface RSVPPageData {
  title: string;
  subtitle: string;
  deadline: string;
  backgroundImage?: string;
  coupleNames?: string;
}

const defaultRSVPData: RSVPPageData = {
  title: "Kindly RSVP",
  subtitle: "We'd love for you to join us!",
  deadline: "Please respond by August 15th, 2025.",
  backgroundImage: "",
  coupleNames: ""
};

export const useRSVPPageData = () => {
  const [data, setData] = useState<RSVPPageData>(defaultRSVPData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rsvpPageData');
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error loading RSVP page data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = (newData: RSVPPageData) => {
    setData(newData);
    localStorage.setItem('rsvpPageData', JSON.stringify(newData));
  };

  return { data, updateData, loading };
};
