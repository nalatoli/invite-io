import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TabNavigation from './TabNavigation';
import EnvelopeIntro from './EnvelopeIntro';
import { verifyGroup } from '../api';
import { type Group } from '../schemas';
import './Layout.css';

interface LayoutProps {
  publicMode?: boolean;
}

export default function Layout({ publicMode = false }: LayoutProps) {
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [showEnvelope, setShowEnvelope] = useState(() => {
    //return true;
    return !localStorage.getItem('invitation-opened');
  });

  const handleEnvelopeOpen = () => {
    localStorage.setItem('invitation-opened', 'true');
    setShowEnvelope(false);
  };

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async (token: string) => {
      try {
        const groupData = await verifyGroup(token);
        if (isMounted) {
          setGroup(groupData);
          setIsValidToken(true);
        }
      } catch {
        if (isMounted) {
          setIsValidToken(false);
        }
      }
    };

    if (token) {
      verifyToken(token);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Public mode: skip token validation
  if (publicMode) {
    return (
      <div className="layout">
        <header className="header">
          <img src="/bismillah.svg" alt="Bismillah" className="header-bismillah" />
          <p className="header-together">Together with their families</p>
          <h1 className="header-title">Norildeen & Ummay</h1>
          <p className="header-invite">Cordially invite you to their Wedding Celebration</p>
        </header>
        <TabNavigation publicMode />
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="sticky-registry-footer">
          <p>We kindly request that no boxed gifts be brought to these events</p>
          <a href="https://www.amazon.com/wedding/guest-view/JVLKC30FV72B" target="_blank" rel="noopener noreferrer">
            🎁 Amazon Registry
          </a>
        </footer>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="layout">
        <div className="error-container">
          <h1>Invalid Invitation</h1>
          <p>Please use the unique link from your invitation.</p>
        </div>
      </div>
    );
  }

  if (isValidToken === null) {
    return (
      <div className="layout">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="layout">
        <div className="error-container">
          <h1>Invalid Invitation Link</h1>
          <p>This invitation link is not valid. Please check your link and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <header className={`header ${showEnvelope ? 'no-blur' : ''}`}>
        <img src="/bismillah.svg" alt="Bismillah" className="header-bismillah" />
        <p className="header-together">Together with their families</p>
        <h1 className="header-title">Norildeen & Ummay</h1>
        <p className="header-invite">Cordially invite you to their Wedding Celebration</p>
      </header>
      {showEnvelope ? (
        <EnvelopeIntro onOpen={handleEnvelopeOpen} group={group} />
      ) : (
        <>
          <TabNavigation token={token} group={group} />
          <main className="main-content">
            <Outlet />
          </main>
          <footer className="sticky-registry-footer">
            <p>We kindly request that no boxed gifts be brought to these events</p>
            <a href="https://www.amazon.com/wedding/guest-view/JVLKC30FV72B" target="_blank" rel="noopener noreferrer">
              🎁 Amazon Registry
            </a>
          </footer>
        </>
      )}
    </div>
  );
}
