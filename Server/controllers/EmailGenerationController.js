const config = require("../configs/configenv")

geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.gemini.api}`


const generateEmailContent = async (emailData) => {
    if (!emailData || typeof emailData !== 'object') {
        throw new Error('Invalid email data provided');
    }

    GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.gemini.api}`
    // Destructure with defaults
    const {
        recipient = 'the recipient',
        subject = 'General Inquiry',
        message = 'No specific message was provided.',
        emotion = 'professional',
        length = 'medium'
    } = emailData;

 
    const prompt = `
You are an expert email writer.

Write an email with the following requirements:
- Audience: ${recipient}
- Subject: "${subject}"
- Purpose: ${message}
- Tone: ${emotion} 
- Desired length: ${length}

The email should:
- Start with an appropriate greeting.
- Clearly communicate the message intent.
- End with a proper closing and sign-off.
- Be human-like, clear, and concise.

Return only the email body. Do not include any explanations.
    `.trim();

    const requestBody = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ]
    };

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        const generatedEmail = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedEmail) {
            throw new Error('No email content returned from Gemini API');
        }

        return generatedEmail;
    } catch (error) {
        console.error('Error generating email content:', error);
        throw new Error('Email generation failed');
    }
};


module.exports = generateEmailContent