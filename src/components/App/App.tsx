import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { GrafanaThemeProvider } from '../../theme';
const Home = React.lazy(() => import('../../pages/Home'));

function App(props: AppRootProps) {
  return (
    <GrafanaThemeProvider>
      <Routes>
        {/* Default page */}
        <Route path="*" element={<Home />} />
      </Routes>
    </GrafanaThemeProvider>
  );
}

export default App;
