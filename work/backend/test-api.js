require('dotenv').config();
const { sendWhatsAppMessage } = require('./src/utils/whatsapp');

async function testWhatsApp() {
    console.log('🔍 Testing WhatsApp Integration...\n');
    
    console.log('📋 Environment Variables Check:');
    console.log('GREENAPI_ID_INSTANCE:', process.env.GREENAPI_ID_INSTANCE ? '✅ Set' : '❌ Missing');
    console.log('GREENAPI_API_TOKEN:', process.env.GREENAPI_API_TOKEN ? '✅ Set' : '❌ Missing');
    console.log('WHATSAPP_RECIPIENT_NUMBER:', process.env.WHATSAPP_RECIPIENT_NUMBER ? '✅ Set' : '❌ Missing');
    
    if (!process.env.GREENAPI_ID_INSTANCE || !process.env.GREENAPI_API_TOKEN || !process.env.WHATSAPP_RECIPIENT_NUMBER) {
        console.log('\n❌ Please set all required environment variables first!');
        return;
    }
    
    console.log('\n📱 Sending test WhatsApp message...');
    const result = await sendWhatsAppMessage('✅ *TEST MESSAGE* \n\nYour Manikya Chits WhatsApp integration is working perfectly! 🎉');
    
    if (result) {
        console.log('✅ Test successful! Check your WhatsApp now.');
    } else {
        console.log('❌ Test failed. Check your GreenAPI credentials.');
    }
}

testWhatsApp();