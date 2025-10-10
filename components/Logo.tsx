import React from 'react';
import { Link } from 'react-router-dom';

const WingmanSVGLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 162 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Wingman Logo"
    >
        <path d="M0 23.333V0.666016H6.13333L11.4 16.2927V0.666016H16.2667V23.333H10.1333L4.86667 7.69935V23.333H0Z" fill="currentColor"/>
        <path d="M22.8667 23.333V0.666016H27.7333V23.333H22.8667Z" fill="currentColor"/>
        <path d="M37.818 23.333L31.9847 0.666016H37.5513L40.7513 13.9327L43.9513 0.666016H49.518L43.6847 23.333H37.818Z" fill="currentColor"/>
        <path d="M52.8513 23.333V0.666016H63.9846V4.93268H57.718V9.79935H63.118V14.066H57.718V18.9993H64.2513V23.333H52.8513Z" fill="currentColor"/>
        <path d="M72.0846 23.333L66.2513 0.666016H71.818L75.018 13.9327L78.218 0.666016H83.7846L77.9513 23.333H72.0846Z" fill="currentColor"/>
        <path d="M93.3361 23.666C89.1028 23.666 85.8028 20.9327 85.8028 16.3327V7.66602C85.8028 3.06602 89.1028 0.332682 93.3361 0.332682C97.5694 0.332682 100.869 3.06602 100.869 7.66602V16.3327C100.869 20.9327 97.5694 23.666 93.3361 23.666ZM93.3361 19.3993C95.4361 19.3993 96.2694 17.4327 96.2694 14.5993V9.39935C96.2694 6.56602 95.4361 4.59935 93.3361 4.59935C91.2361 4.59935 90.4028 6.56602 90.4028 9.39935V14.5993C90.4028 17.4327 91.2361 19.3993 93.3361 19.3993Z" fill="currentColor"/>
        <path d="M110.869 23.3327L105.136 0.666016H110.536L113.603 13.9993L116.669 0.666016H122.069L116.336 23.3327H110.869Z" fill="currentColor"/>
        <path d="M124.969 23.3327V0.666016H140.336V4.99935H129.569V9.86602H139.469V14.1993H129.569V18.9993H140.603V23.3327H124.969Z" fill="currentColor"/>
        <path d="M158.469 16.3327L161.469 0.666016H155.803L154.036 10.3327L150.803 0.666016H145.236L149.803 23.3327H154.969L155.803 18.1327L158.536 23.3327H162L158.469 16.3327Z" fill="currentColor"/>
    </svg>
);


const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className || ''}`}>
      <div className="w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-accent">
          <path d="M2 3L8.33333 13L12 21L15.6667 13L22 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13L2 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13L22 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <WingmanSVGLogo className="h-4 text-text-primary hidden sm:block" />
    </Link>
  );
};

export default Logo;