import config from "../configs/configenv";
import { fetchWithAutoRefresh } from "./Authentication";

const fetchUserEmails = async () => {
  try {
    const response = await fetchWithAutoRefresh(`${config.Server.serverUrl}/dashboard/emails`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching emails:", result.error || result.message);
      return [];
    }

    console.log("Fetched Emails:", result);
    return result; // Return the email data for use in the component
    
  } catch (err) {
    console.error("Network error:", err);
    return [];
  }
};

export default fetchUserEmails;