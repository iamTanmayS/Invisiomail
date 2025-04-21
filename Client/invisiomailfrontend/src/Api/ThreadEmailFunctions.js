export const fetchThreads = async (labelIds = ['INBOX'], query = '', pageToken = '', maxResults = 20) => {
    try {
      const params = new URLSearchParams();
      if (labelIds.length > 0) params.append('labelIds', labelIds.join(','));
      if (query) params.append('query', query);
      if (pageToken) params.append('pageToken', pageToken);
      params.append('maxResults', maxResults);
  
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/threads?${params}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching threads:', err);
      throw err;
    }
  };
  
  export const fetchThread = async (threadId) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/threads/${threadId}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error('Error fetching thread:', err);
      throw err;
    }
  };