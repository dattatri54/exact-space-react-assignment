import React from 'react';
import PhotoGallery from './components/PhotoGallery';

export function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="gallery-title">Photo gallery</h1>
      </header>
      <main className="app-main">
        <PhotoGallery />
      </main>
    </div>
  );
}

export default App;
