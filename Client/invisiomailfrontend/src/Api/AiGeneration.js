import config from "../configs/configenv"

async function generateEmail(emailData) {
    try {
        const response = await fetch(`${config.Server.serverUrl}/write-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error('Failed to generate email content');
        }

        const data = await response.json();
        console.log('Generated Email:', data.email);
        return data.email;

    } 
    catch (error)
    {
        console.error('Error:', error);
        throw new Error('Error generating email');
    }
}

export default generateEmail;