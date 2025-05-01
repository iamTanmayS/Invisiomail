import config from "../configs/configenv";
import { fetchWithAutoRefresh } from "./Authentication";

export const fetchallemails = async () => {
    try {
      const res =  await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails`, {
        method: 'GET',
        credentials: 'include',
      });
     
      const emails = await res.json();
      return emails
    } catch (err) {
      console.error('Error fetching emails:', err);
      throw err;
    }
  };


  export const fetchemailcontent = async(emailId) => {
    try{
         const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/emails/${emailId}`,{
          method:"GET",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          }
          })
          return res;
    }  
     catch(err){
               console.error('Error fetching email Content:',err)
               throw err;
     }
  };

export const createRawMail = async ({ to, subject, body, cc = '', bcc = '' }) => {
    try {
      const res = await fetchWithAutoRefresh(`${config.Server.serverUrl}/sendMail`, {
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