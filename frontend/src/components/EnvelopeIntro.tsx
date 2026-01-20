import { useState, useEffect } from 'react';
import { type Group } from '../schemas';
import './EnvelopeIntro.css';

interface EnvelopeIntroProps {
  onOpen: () => void;
  group: Group | null;
}

export default function EnvelopeIntro({ onOpen, group }: EnvelopeIntroProps) {
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div className={`intro-container ${isOpening ? 'opening' : ''}`} onClick={handleClick}>
      <div className="intro-card">
        <div className="intro-content">
          <div className="tap-circle">
            <span className="tap-icon"></span>
          </div>
          {group && <p className="tap-greeting">{group.name}</p>}
          <p className="tap-text">Tap to Open</p>
        </div>
      </div>
    </div>
  );
}
