const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

const chatWithCopilot = async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // extract patient context safely
  const vitals = context?.vitals || {};
  const healthScore = context?.healthScore || 0;
  const scoreChange = context?.scoreChange || 0;
  const organStatus = context?.organStatus || {};
  const recentAlerts = context?.recentAlerts || [];
  const userProfile = context?.userProfile || {};

  // Build comprehensive patient context
  const patientContext = `
PATIENT PROFILE:
- Name: ${userProfile.name || 'Patient'}
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}

CURRENT VITAL SIGNS:
- Heart Rate: ${vitals.heartRate || 'N/A'} bpm
- Blood Pressure: ${vitals.bloodPressure || 'N/A'} mmHg
- Blood Oxygen (SpO2): ${vitals.oxygen || 'N/A'}%
- Body Temperature: ${vitals.temperature || 'N/A'}°F
- Daily Activity: ${vitals.steps || 'N/A'} steps today

HEALTH STATUS:
- Overall Health Score: ${healthScore}/100 ${scoreChange > 0 ? `(+${scoreChange}% improvement from last week)` : scoreChange < 0 ? `(${scoreChange}% decline from last week)` : ''}
- Heart Status: ${organStatus.heart || 'normal'}
- Brain Status: ${organStatus.brain || 'normal'}
- Lungs Status: ${organStatus.lungs || 'normal'}
- Liver Status: ${organStatus.liver || 'normal'}

RECENT HEALTH ALERTS:
${recentAlerts.length > 0 ? recentAlerts.map(alert => 
  `- [${alert.type?.toUpperCase() || 'INFO'}] ${alert.title}: ${alert.desc}`
).join('\n') : '- No recent alerts'}
  `.trim();

  const systemInstruction = `You are CareBridge AI Health Copilot, a professional medical AI assistant specialized in personalized health guidance.

${patientContext}

INSTRUCTIONS:
1. Provide personalized health advice based on the patient's ACTUAL DATA shown above
2. Reference their specific vital signs, health score, and alerts in your response
3. If their heart status is "warning" or they have elevated readings, acknowledge this
4. Be empathetic, professional, and concise (2-3 sentences max)
5. For critical issues or persistent symptoms, always recommend consulting a healthcare provider
6. Use simple, non-technical language that patients can understand
7. If asked about improvement, reference their health score trend

Respond directly to the patient in a caring, supportive tone.`;

  try {
    // STRATEGY: Try Local Ollama first (if in dev), otherwise fall back to Gemini
    // For deployment, we prefer Gemini as Ollama isn't available
    
    // Check if we are in production or explicitly want to use Cloud API
    const useCloudAI = process.env.NODE_ENV === 'production' || !process.env.OLLAMA_URL;

    if (!useCloudAI) {
      try {
        console.log('Attempting Local Ollama (Phi)...');
        const response = await axios.post(OLLAMA_URL, {
          model: 'phi',
          prompt: `${systemInstruction}\n\nUSER QUESTION: ${message}`,
          stream: false,
        }, { timeout: 5000 }); // Short timeout to fail fast to Gemini
        
        return res.json({ response: response.data.response });
      } catch (ollamaError) {
        console.warn('Ollama unavailable, switching to Gemini Fallback...', ollamaError.message);
      }
    }

    // Gemini Fallback / Production Mode
    console.log('Using Google Gemini API...');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key not configured');
    }

    const result = await geminiModel.generateContent(`${systemInstruction}\n\nUSER QUESTION: ${message}`);
    const geminiResponse = await result.response;
    const text = geminiResponse.text();

    res.json({ response: text });

  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ 
      error: 'AI Copilot is currently offline. Please try again later.',
      details: error.message 
    });
  }
};

const explainAlert = async (alertData) => {
  try {
    const prompt = `
      Explain the following health alert in simple terms and suggest preventive care:
      Alert: ${alertData.title}
      Description: ${alertData.description}
      Severity: ${alertData.severity}
    `;

    // STRATEGY: Try Local Ollama first (if in dev), otherwise fall back to Gemini
    const useCloudAI = process.env.NODE_ENV === 'production' || !process.env.OLLAMA_URL;

    if (!useCloudAI) {
      try {
        console.log('Attempting Local Ollama (Phi) for Alert Explanation...');
        const response = await axios.post(OLLAMA_URL, {
          model: 'phi',
          prompt: prompt,
          stream: false,
        }, { timeout: 5000 });
        
        return response.data.response;
      } catch (ollamaError) {
        console.warn('Ollama unavailable for alert, switching to Gemini Fallback...');
      }
    }

    // Gemini Fallback
    if (!GEMINI_API_KEY) {
      return 'AI explanation unavailable (API Key missing).';
    }

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('AI Explanation Error:', error.message);
    return 'Could not generate AI explanation. Please check your vitals manually.';
  }
};

module.exports = {
  chatWithCopilot,
  explainAlert,
};
