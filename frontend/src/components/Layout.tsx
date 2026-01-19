import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TabNavigation from './TabNavigation';
import { verifyGroup } from '../api';
import { type Group } from '../schemas';
import './Layout.css';

export default function Layout() {
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

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
      <header className="header">
        <img src="/bismillah.svg" alt="Bismillah" className="header-bismillah" />
        <p className="header-together">Together with their families</p>
        <h1 className="header-title">Ummay & Norildeen</h1>
        <p className="header-invite">Cordially invite you to their Wedding Celebration</p>
      </header>
      <TabNavigation token={token} group={group} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
