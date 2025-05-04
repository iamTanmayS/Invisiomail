const Express = require("express")
const AiGenerationRouter = Express.Router()
const generateEmailContent = require('../controllers/EmailGenerationController')




AiGenerationRouter.post('/write-email', async (req, res) => {
    try {
        const emailData = req.body;

        
        if (!emailData || typeof emailData !== 'object') {
            return res.status(400).json({ error: 'Invalid email data provided' });
        }

        
        const generatedEmail = await generateEmailContent(emailData);

       
        return res.json({ email: generatedEmail });
    } catch (error) {
        console.error('Error generating email content:', error);
        return res.status(500).json({ error: 'Email generation failed. Please try again later.' });
    }
});

module.exports = AiGenerationRouter;