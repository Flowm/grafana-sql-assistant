import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
const Home = React.lazy(() => import('../../pages/Home'));

function App(props: AppRootProps) {
  return (
    <Routes>
      {/* Default page */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
