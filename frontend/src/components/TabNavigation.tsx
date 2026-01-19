import { NavLink } from 'react-router-dom';
import { type Group } from '../schemas';
import './TabNavigation.css';

interface TabNavigationProps {
  token: string;
  group: Group | null;
}

export default function TabNavigation({ token, group }: TabNavigationProps) {
  if (!group) return null;

  // Determine the label for the Nikkah/Wedding tab
  const showNikkah = group.invited_to_nikkah;
  const showWedding = group.invited_to_wedding;
  let nikkahWeddingLabel = '';

  if (showNikkah && showWedding) {
    nikkahWeddingLabel = 'Nikkah';
  } else if (showNikkah) {
    nikkahWeddingLabel = 'Nikkah';
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
          {nikkahWeddingLabel}
        </NavLink>
      )}
      {group.invited_to_henna && (
        <NavLink
          to={`/${token}/henna`}
          className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}
        >
          Henna
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
