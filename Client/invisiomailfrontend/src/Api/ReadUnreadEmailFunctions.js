import { fetchWithAutoRefresh } from "./Authentication";
import config from "../configs/configenv";

export const markEmailAsRead = async (messageId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${messageId}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error marking email as read:', err);
      throw err;
    }
  };
  
  export const markEmailAsUnread = async (messageId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${messageId}/unread`, {
        method: 'POST',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error marking email as unread:', err);
      throw err;
    }
  };
  
  export const archiveEmail = async (messageId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${messageId}/archive`, {
        method: 'POST',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error archiving email:', err);
      throw err;
    }
  };
  
  export const trashEmail = async (messageId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${messageId}/trash`, {
        method: 'POST',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error trashing email:', err);
      throw err;
    }
  };