import { NavLink } from 'react-router-dom';
import { type Group } from '../schemas';
import './TabNavigation.css';

interface TabNavigationProps {
  token?: string;
  group?: Group | null;
  publicMode?: boolean;
}

export default function TabNavigation({ token, group, publicMode = false }: TabNavigationProps) {
  // Public mode: show only Nikkah and Henna tabs (no RSVP)
  if (publicMode) {
    return (
      <nav className="tab-navigation">
        <NavLink
          to="/nikkah"
          className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}
        >
          Nikkah &<br />Reception
        </NavLink>
        <NavLink
          to="/henna"
          className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}
        >
          Gaye Holud &<br />Henna
        </NavLink>
      </nav>
    );
  }

  if (!group) return null;

  // Determine the label for the Nikkah/Wedding tab
  const showNikkah = group.invited_to_nikkah;
  const showWedding = group.invited_to_wedding;
  let nikkahWeddingLabel = '';

  if (showNikkah && showWedding) {
    nikkahWeddingLabel = 'Nikkah & Reception';
  } else if (showNikkah) {
    nikkahWeddingLabel = 'Nikkah & Reception';
  } else if (showWedding) {
    nikkahWeddingLabel = 'Reception';
  }

  return (
    <nav className="tab-navigation">
      {(showNikkah || showWedding) && (
        <NavLink
          to={`/${token}/nikkah`}
          className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}
        >
          {showNikkah ? (<>Nikkah &<br />Reception</>) : 'Reception'}
        </NavLink>
      )}
      {group.invited_to_henna && (
        <NavLink
          to={`/${token}/henna`}
          className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}
        >
          Gaye Holud &<br />Henna
        </NavLink>
      )}
      <NavLink
        to={`/${token}/rsvp`}
        className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}
      >
        RSVP
      </NavLink>
    </nav>
  );
}
