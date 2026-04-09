// utils/whatsapp.js - CORRECTED VERSION

/**
 * Send WhatsApp message using GreenAPI with native fetch
 * @param {string} message - The message text to send
 * @returns {Promise<boolean>} - Returns true if sent successfully
 */
async function sendWhatsAppMessage(message) {
    try {
        const idInstance = process.env.GREENAPI_ID_INSTANCE;
        const apiToken = process.env.GREENAPI_API_TOKEN;
        const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER;
        
        if (!idInstance || !apiToken) {
            console.error('❌ GreenAPI credentials missing in environment variables');
            return false;
        }
        
        if (!recipientNumber) {
            console.error('❌ WHATSAPP_RECIPIENT_NUMBER not configured');
            return false;
        }
        
        // Format recipient number: add @c.us suffix if not present
        let chatId = recipientNumber;
        if (!chatId.includes('@c.us')) {
            chatId = `${chatId}@c.us`;
        }
        
        // Fixed URL construction - removed trailing slash issue
        const url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`;
        
        const payload = {
            chatId: chatId,
            message: message
        };
        
        console.log(`📱 Sending WhatsApp message to ${chatId}...`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        // GreenAPI returns idMessage on success, error on failure
        if (result.idMessage) {
            console.log('✅ WhatsApp message sent successfully!');
            console.log('Message ID:', result.idMessage);
            return true;
        } else if (result.code === 200) {
            // Alternative success response format
            console.log('✅ WhatsApp message sent successfully!');
            return true;
        } else {
            console.error('❌ GreenAPI error:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send WhatsApp message:', error.message);
        return false;
    }
}

// Keep all the formatting functions the same as before...
function formatChitPlanMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    return `🔔 *NEW CHIT PLAN INQUIRY* 🔔
    
📌 *Name:* ${data.name}
📞 *Mobile:* ${data.mobile}
📧 *Email:* ${data.email}
⏰ *Time:* ${timestamp}

💡 *Customer is interested in chit plans. Please contact them soon.*`;
}

function formatContactMessage(data) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
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

module.exports = {
    sendWhatsAppMessage,
    formatChitPlanMessage,
    formatContactMessage,
    formatFeedbackMessage,
    formatCareerMessage
};