import React from 'react';
import Avatar from '@mui/material/Avatar';

import { AvtarInterface } from '../../../../interface/assesment-interface';
import { height, width } from '@mui/system';

const avatarContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const avatarContainerForSmallImg = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '24px',
  height: '24px'
}

const AvtarSection = ({ firstName, lastName, profile, studentImg }: AvtarInterface) => {
  let initials = '';
  
  // Check if firstName exists, if yes, take the first character
  if (firstName) {
    initials += firstName.charAt(0);
  }
  
  // Check if lastName exists, if yes, take the first character
  if (lastName) {
    initials += lastName.charAt(0);
  }
  
  // Render avatar based on profile URL availability
  if (profile) {
    return <Avatar style={studentImg ? avatarContainerForSmallImg : avatarContainer} alt={`${firstName} ${lastName}`} src={profile} />;
  } else if (initials) {
    return <Avatar style={studentImg ? avatarContainerForSmallImg : avatarContainer}>{initials}</Avatar>;
  } else {
    return null; // No content to display
  }
};

export default AvtarSection;