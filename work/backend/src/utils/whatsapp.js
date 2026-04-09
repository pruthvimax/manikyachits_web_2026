const { GreenAPI } = require('greenapi');

// Initialize GreenAPI client
let greenApiClient = null;

function getGreenAPIClient() {
    if (!greenApiClient) {
        const idInstance = process.env.GREENAPI_ID_INSTANCE;
        const apiToken = process.env.GREENAPI_API_TOKEN;
        
        if (!idInstance || !apiToken) {
            throw new Error('GreenAPI credentials not configured in environment variables');
        }
        
        greenApiClient = new GreenAPI({
            idInstance: idInstance,
            apiTokenInstance: apiToken,
            apiUrl: process.env.GREENAPI_API_URL || 'https://api.green-api.com'
        });
    }
    return greenApiClient;
}

/**
 * Send WhatsApp message using GreenAPI
 * @param {string} message - The message text to send
 * @returns {Promise<boolean>} - Returns true if sent successfully
 */
async function sendWhatsAppMessage(message) {
    try {
        const client = getGreenAPIClient();
        const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER;
        
        if (!recipientNumber) {
            throw new Error('WHATSAPP_RECIPIENT_NUMBER not configured');
        }
        
        // Format recipient number: add @c.us suffix if not present
        let chatId = recipientNumber;
        if (!chatId.includes('@c.us')) {
            chatId = `${chatId}@c.us`;
        }
        
        console.log(`📱 Sending WhatsApp message to ${chatId}...`);
        
        // Send the message using GreenAPI
        const response = await client.sending.sendMessage(chatId, message);
        
        if (response && response.code === 200) {
            console.log('✅ WhatsApp message sent successfully!');
            console.log('Message ID:', response.data?.idMessage);
            return true;
        } else {
            console.error('❌ GreenAPI error:', response);
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send WhatsApp message:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        return false;
    }
}

/**
 * Format notification message for Chit Plan Inquiry
 */
function formatChitPlanMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    return `🔔 *NEW CHIT PLAN INQUIRY* 🔔
    
📌 *Name:* ${data.name}
📞 *Mobile:* ${data.mobile}
📧 *Email:* ${data.email}
⏰ *Time:* ${timestamp}

💡 *Customer is interested in chit plans. Please contact them soon.*`;
}

/**
 * Format notification message for Contact Form
 */
function formatContactMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    // Map subject codes to readable labels
    const subjectLabels = {
        'chit-info': 'Chit Information',
        'existing-customer': 'Existing Customer',
        'new-account': 'New Account',
        'auction': 'Auction Related',
        'payment': 'Payment Query',
        'technical': 'Technical Issue',
        'other': 'Other'
    };
    
    const subjectText = subjectLabels[data.subject] || data.subject;
    
    return `📞 *NEW CONTACT FORM SUBMISSION* 📞
    
👤 *Name:* ${data.fullName}
📱 *Phone:* ${data.phoneNumber}
📧 *Email:* ${data.email}
📋 *Subject:* ${subjectText}
💬 *Message:* ${data.message}
📰 *Newsletter:* ${data.newsletter ? 'Yes' : 'No'}
⏰ *Time:* ${timestamp}`;
}

/**
 * Format notification message for Feedback
 */
function formatFeedbackMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const stars = '⭐'.repeat(data.rating);
    const emptyStars = '☆'.repeat(5 - data.rating);
    
    const categoryLabels = {
        'general': 'General Feedback',
        'service': 'Customer Service',
        'app': 'App/Website',
        'payment': 'Payment Related',
        'chit': 'Chit Plan',
        'suggestion': 'Suggestion',
        'complaint': 'Complaint'
    };
    
    const categoryText = categoryLabels[data.category] || data.category;
    
    return `💬 *NEW FEEDBACK RECEIVED* 💬
    
👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
🏷️ *Category:* ${categoryText}
⭐ *Rating:* ${data.rating}/5 ${stars}${emptyStars}
💭 *Message:* ${data.message}
⏰ *Time:* ${timestamp}`;
}

/**
 * Format notification message for Career Application
 */
function formatCareerMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    return `💼 *NEW JOB APPLICATION* 💼
    
👤 *Name:* ${data.firstName} ${data.lastName}
📱 *Phone:* ${data.phoneNumber}
📧 *Email:* ${data.email}
🎓 *Qualification:* ${data.qualification || 'Not specified'}
💼 *Position:* ${data.jobRole}
💬 *Message:* ${data.comments || 'No additional comments'}
⏰ *Time:* ${timestamp}`;
}

// Export all functions
module.exports = {
    sendWhatsAppMessage,
    formatChitPlanMessage,
    formatContactMessage,
    formatFeedbackMessage,
    formatCareerMessage
};