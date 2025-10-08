// Notification Configuration
// This file contains configuration for real email and SMS sending

const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email Configuration
const emailConfig = {
    // Gmail SMTP Configuration (you can use other providers)
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password' // Use App Password for Gmail
    }
};

// SMS Configuration (Twilio)
const smsConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-account-sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-auth-token',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '+1234567890' // Your Twilio phone number
};

// WhatsApp Configuration (Twilio WhatsApp Business API)
const whatsappConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-account-sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-auth-token',
    fromNumber: process.env.WHATSAPP_FROM_NUMBER || 'whatsapp:+14155238886' // Twilio WhatsApp sandbox number
};

// Create email transporter
let emailTransporter = null;
try {
    emailTransporter = nodemailer.createTransporter(emailConfig);
    console.log('✅ Email transporter created successfully');
} catch (error) {
    console.log('⚠️ Email transporter creation failed:', error.message);
}

// Create Twilio client for SMS and WhatsApp
let twilioClient = null;
try {
    if (smsConfig.accountSid && smsConfig.authToken) {
        twilioClient = twilio(smsConfig.accountSid, smsConfig.authToken);
        console.log('✅ Twilio client created successfully');
    }
} catch (error) {
    console.log('⚠️ Twilio client creation failed:', error.message);
}

// Real Email Sending Function
async function sendRealEmail(to, subject, message) {
    if (!emailTransporter) {
        console.log('❌ Email transporter not available - using simulation');
        return sendSimulatedEmail(to, subject, message);
    }

    try {
        const mailOptions = {
            from: emailConfig.auth.user,
            to: to,
            subject: subject,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎓 AI Learning Platform</h1>
                    </div>
                    <div style="padding: 20px; background: #f8f9fa;">
                        <h2 style="color: #333; margin-top: 0;">${subject}</h2>
                        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${message}</pre>
                        </div>
                        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; text-align: center;">
                            <p style="margin: 0; color: #1976d2; font-size: 14px;">
                                📚 This notification was sent from the AI Learning Platform<br>
                                🕐 ${new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const result = await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Real email sent successfully to ${to}:`, result.messageId);
        
        // Store notification in logs
        const notifications = require('./data/notifications.json') || [];
        notifications.push({
            id: Date.now().toString(),
            type: 'email',
            recipient: to,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'sent',
            messageId: result.messageId,
            isReal: true
        });
        require('fs').writeFileSync('./data/notifications.json', JSON.stringify(notifications, null, 2));
        
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Failed to send real email:', error.message);
        // Fallback to simulation
        return sendSimulatedEmail(to, subject, message);
    }
}

// Real SMS Sending Function
async function sendRealSMS(to, message) {
    if (!twilioClient) {
        console.log('❌ Twilio client not available - using simulation');
        return sendSimulatedSMS(to, message);
    }

    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: smsConfig.fromNumber,
            to: to
        });

        console.log(`✅ Real SMS sent successfully to ${to}:`, result.sid);
        
        // Store notification in logs
        const notifications = require('./data/notifications.json') || [];
        notifications.push({
            id: Date.now().toString(),
            type: 'sms',
            recipient: to,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'sent',
            messageId: result.sid,
            isReal: true
        });
        require('fs').writeFileSync('./data/notifications.json', JSON.stringify(notifications, null, 2));
        
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('❌ Failed to send real SMS:', error.message);
        // Fallback to simulation
        return sendSimulatedSMS(to, message);
    }
}

// Real WhatsApp Sending Function
async function sendRealWhatsApp(to, message) {
    if (!twilioClient) {
        console.log('❌ Twilio client not available - using simulation');
        return sendSimulatedWhatsApp(to, message);
    }

    try {
        // Format phone number for WhatsApp
        const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        
        const result = await twilioClient.messages.create({
            body: message,
            from: whatsappConfig.fromNumber,
            to: whatsappTo
        });

        console.log(`✅ Real WhatsApp sent successfully to ${to}:`, result.sid);
        
        // Store notification in logs
        const notifications = require('./data/notifications.json') || [];
        notifications.push({
            id: Date.now().toString(),
            type: 'whatsapp',
            recipient: to,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'sent',
            messageId: result.sid,
            isReal: true
        });
        require('fs').writeFileSync('./data/notifications.json', JSON.stringify(notifications, null, 2));
        
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('❌ Failed to send real WhatsApp:', error.message);
        // Fallback to simulation
        return sendSimulatedWhatsApp(to, message);
    }
}

// Fallback simulation functions
function sendSimulatedEmail(to, subject, message) {
    console.log(`📧 [SIMULATED] Email to ${to}: ${subject}\n${message}`);
    
    const notifications = require('./data/notifications.json') || [];
    notifications.push({
        id: Date.now().toString(),
        type: 'email',
        recipient: to,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'simulated',
        isReal: false
    });
    require('fs').writeFileSync('./data/notifications.json', JSON.stringify(notifications, null, 2));
    
    return { success: true, simulated: true };
}

function sendSimulatedSMS(to, message) {
    console.log(`📱 [SIMULATED] SMS to ${to}: ${message}`);
    
    const notifications = require('./data/notifications.json') || [];
    notifications.push({
        id: Date.now().toString(),
        type: 'sms',
        recipient: to,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'simulated',
        isReal: false
    });
    require('fs').writeFileSync('./data/notifications.json', JSON.stringify(notifications, null, 2));
    
    return { success: true, simulated: true };
}

function sendSimulatedWhatsApp(to, message) {
    console.log(`📱 [SIMULATED] WhatsApp to ${to}: ${message}`);
    
    const notifications = require('./data/notifications.json') || [];
    notifications.push({
        id: Date.now().toString(),
        type: 'whatsapp',
        recipient: to,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'simulated',
        isReal: false
    });
    require('fs').writeFileSync('./data/notifications.json', JSON.stringify(notifications, null, 2));
    
    return { success: true, simulated: true };
}

// Test functions
async function testEmailSending() {
    console.log('🧪 Testing email sending...');
    const result = await sendRealEmail(
        'test@example.com',
        'Test Email from AI Learning Platform',
        'This is a test email to verify the email sending functionality is working correctly.'
    );
    console.log('Email test result:', result);
}

async function testSMSSending() {
    console.log('🧪 Testing SMS sending...');
    const result = await sendRealSMS(
        '+1234567890',
        'Test SMS from AI Learning Platform - This is a test message to verify SMS functionality.'
    );
    console.log('SMS test result:', result);
}

async function testWhatsAppSending() {
    console.log('🧪 Testing WhatsApp sending...');
    const result = await sendRealWhatsApp(
        '+1234567890',
        'Test WhatsApp from AI Learning Platform - This is a test message to verify WhatsApp functionality.'
    );
    console.log('WhatsApp test result:', result);
}

module.exports = {
    sendRealEmail,
    sendRealSMS,
    sendRealWhatsApp,
    sendSimulatedEmail,
    sendSimulatedSMS,
    sendSimulatedWhatsApp,
    testEmailSending,
    testSMSSending,
    testWhatsAppSending,
    emailConfig,
    smsConfig,
    whatsappConfig
};
