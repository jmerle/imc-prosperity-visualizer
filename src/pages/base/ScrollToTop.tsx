import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop(): ReactNode {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
