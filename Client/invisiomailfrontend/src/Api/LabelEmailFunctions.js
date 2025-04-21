import { fetchWithAutoRefresh } from "./Authentication";
import config from "../configs/configenv";

export const fetchLabels = async () => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/labels`, {
        method: 'GET',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching labels:', err);
      throw err;
    }
  };
  
  export const createLabel = async (name, options = {}) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/labels`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, options }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating label:', err);
      throw err;
    }
  };
  
  export const addLabelToEmail = async (messageId, labelId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${messageId}/labels`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ labelId }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error adding label to email:', err);
      throw err;
    }
  };
  
  export const removeLabelFromEmail = async (messageId, labelId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${messageId}/labels/${labelId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error removing label from email:', err);
      throw err;
    }
  };
  