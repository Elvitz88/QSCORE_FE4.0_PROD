import React, { useState, useEffect, useCallback } from "react";
import QscoreForm from "../components/QscoreForm";
import { useNavigate } from "react-router-dom";
import useFetchQScore from "../services/FetchQScore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const Qscore = () => {
  const [qscores, setQscores] = useState([]);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const apiUrl = import.meta.env.VITE_REACT_APP_API_DB_URL || 'http://localhost:8002';
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const apiSecret = import.meta.env.VITE_REACT_APP_API_SECRET;
  const navigate = useNavigate();

  const { fetchQScore, result, error, isLoading } = useFetchQScore(apiUrl);

  useEffect(() => {
    if (result) {
      setQscores(result);
    }
  }, [result]);

  const loginAndFetchQscores = useCallback(async () => {
    try {
      console.log("Attempting login...");

      const loginResponse = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          apiSecret,
        }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Login failed');
      }

      const accessToken = loginData.accessToken;
      const refreshToken = loginData.refreshToken;
      sessionStorage.setItem('qscoreAccessToken', accessToken);
      sessionStorage.setItem('qscoreRefreshToken', refreshToken);
      console.log("Tokens stored in sessionStorage");

      const response = await fetch(`${apiUrl}/qscore/qscores`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch qscores');
      }

      const data = await response.json();
      setQscores(data);
    } catch (error) {
      console.error('Failed to fetch qscores:', error);
    }
  }, [apiUrl, apiKey, apiSecret]);

  useEffect(() => {
    loginAndFetchQscores();
  }, [loginAndFetchQscores]);

  const handleAddOrEdit = (data = {}) => {
    setIsAddingOrEditing(true);
    setEditingData(data);
  };

  const handleCancel = () => {
    setIsAddingOrEditing(false);
  };

  const handleDelete = useCallback(async (qscoreId) => {
    try {
      const token = sessionStorage.getItem('qscoreAccessToken');
      if (!token) {
        navigate('/login'); // Redirect to login page if no token
        throw new Error('Token not found');
      }
      await fetch(`${apiUrl}/qscore/qscores/${qscoreId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      loginAndFetchQscores();
    } catch (error) {
      console.error('Failed to delete qscore:', error);
    }
  }, [apiUrl, loginAndFetchQscores, navigate]);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      const token = sessionStorage.getItem('qscoreAccessToken');
      if (!token) {
        navigate('/login'); // Redirect to login page if no token
        throw new Error('Token not found');
      }
      const method = data.qscore_id ? 'PUT' : 'POST';
      const endpoint = data.qscore_id
        ? `${apiUrl}/qscore/qscores/${data.qscore_id}`
        : `${apiUrl}/qscore/qscores`;

      await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      setIsAddingOrEditing(false);
      loginAndFetchQscores();
    } catch (error) {
      console.error('Failed to submit qscore:', error);
    }
  }, [apiUrl, loginAndFetchQscores, navigate]);

  return (
    <div className="flex justify-center w-full">
      <div className="container overflow-x-auto m-4">
        <div className="flex flex-col items-center">
          <p className="text-center text-2xl font-bold m-4">Q-Score management</p>
          <button onClick={() => handleAddOrEdit()} className="btn btn-active btn-link">Add New Qscore</button>
        </div>
        {isAddingOrEditing && (
          <QscoreForm
            onSubmit={(data) => handleFormSubmit(data)}
            initialData={editingData}
            onCancel={handleCancel}
          />
        )}
        <div className="overflow-x-auto ml-20">
          <table className="table w-full">
            <thead className="text-xl font-bold">
              <tr>
                <th>Vendor</th>
                <th>Material</th>
                <th>Qscore</th>
                <th>Evaluate</th>
                <th>Sampling</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="font-base">
              {Array.isArray(qscores) && qscores.map((qscore) => (
                <tr key={qscore.qscore_id}>
                  <td>{qscore.vendor}</td>
                  <td>{qscore.material}</td>
                  <td>{qscore.qscore}</td>
                  <td>{qscore.evaluate}</td>
                  <td>{qscore.sampling}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-primary"
                      onClick={() => handleAddOrEdit(qscore)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      className="btn btn-outline btn-secondary ml-2"
                      onClick={() => handleDelete(qscore.qscore_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Qscore;
