"use client"
import React, { useEffect, useState } from 'react'

export default function AnimatedText({ text }) {
    const [displayText, setDisplayText] = useState('');
  
    useEffect(() => {
      setDisplayText(''); // Reset displayText when text prop changes
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, 200);
  
      return () => clearInterval(timer);
    }, []);
  
    return <div>{displayText}</div>;
  }