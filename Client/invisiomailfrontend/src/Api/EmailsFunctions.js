import { fetchWithAutoRefresh } from "./Authentication";
import config from "../configs/configenv";

export const fetchallemails = async () => {
    try {
      const res =  await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log(await res.json())
     return res;
    } catch (err) {
      console.error('Error fetching emails:', err);
      throw err;
    }
  };

export const createRawMail = async ({ to, subject, body, cc = '', bcc = '' }) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/send-email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({to, subject, body, cc, bcc}),
      });
      return res;
    } catch (err) {
      console.error('Error creating email:', err);
      throw err;
    }
  };