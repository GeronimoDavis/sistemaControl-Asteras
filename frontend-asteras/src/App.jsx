import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect } from 'react';
import API from './api';
import './App.css'

function App() {
  useEffect(() => {
    API.get('/productos')
      .then(res => {
        console.log("Productos:", res.data);
      })
      .catch(err => {
        console.error("Error al obtener productos:", err);
      });
  }, []);

  return (
    <div>
      <h1>Conexión Front - Back</h1>
    </div>
  );
}

export default App
