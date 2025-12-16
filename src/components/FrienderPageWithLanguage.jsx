import React from 'react';
import FrienderPage from './FrienderPage';
import { useValidLanguage } from '../hooks/useValidLanguage';

function FrienderPageWithLanguage() {
  const validLanguage = useValidLanguage();

  return <FrienderPage language={validLanguage} />;
}

export default FrienderPageWithLanguage;
