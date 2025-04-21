import { fetchWithAutoRefresh } from "./Authentication";
import config from "../configs/configenv";



export const fetchDrafts = async (maxResults = 50) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/drafts?maxResults=${maxResults}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching drafts:', err);
      throw err;
    }
  };
  
  export const fetchDraft = async (draftId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/drafts/${draftId}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching draft:', err);
      throw err;
    }
  };
  
  export const createDraft = async ({ to, subject, body, cc = '', bcc = '' }) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/drafts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body, cc, bcc }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating draft:', err);
      throw err;
    }
  };
  
  export const updateDraft = async (draftId, { to, subject, body, cc = '', bcc = '' }) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/drafts/${draftId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body, cc, bcc }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating draft:', err);
      throw err;
    }
  };
  
  export const sendDraft = async (draftId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/drafts/${draftId}/send`, {
        method: 'POST',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error sending draft:', err);
      throw err;
    }
  };
  
  export const deleteDraft = async (draftId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/drafts/${draftId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting draft:', err);
      throw err;
    }
  };


  