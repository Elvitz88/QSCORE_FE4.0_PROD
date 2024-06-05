//src/services/FetchQscore
import { useState, useCallback } from 'react';

const useFetchQScore = (apiUrl) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchQScore = useCallback(async (params) => {
    setIsLoading(true);
    setError('');

    // Convert params to query string
    const queryString = new URLSearchParams(params).toString();

    try {
      const token = sessionStorage.getItem('qscoreToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`${apiUrl}/qscore?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorData = { message: 'Something went wrong' };
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(`Failed to fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  return { fetchQScore, result, error, isLoading };
};

export default useFetchQScore;
