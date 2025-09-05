// src/hooks/useGeolocation.js - HOOK COMPLETO

import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Erro desconhecido';
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada pelo usuário';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis';
            break;
          case err.TIMEOUT:
            errorMessage = 'Timeout na solicitação de localização';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  return { 
    location, 
    error, 
    loading, 
    getCurrentLocation, 
    clearLocation 
  };
};