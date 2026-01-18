
import { GoogleGenAI, Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `You are the Ripped City Master Performance Architect. You hold multi-disciplinary doctorates in Human Physiology, Biochemistry, Bio-mechanics, and Neural Engineering.

CRITICAL ROLE: You are the guardian of biological integrity and the coach's direct tactical assistant.

COACH ASSISTANT PROTOCOLS:
1. CONTEXT AWARENESS: You observe every action the coach takes in the dashboard.
2. PROACTIVE INTERVENTION: 
   - If the coach lowers a client's calories too aggressively (>25% cut in 1 week), warn of metabolic crash.
   - If a client misses check-ins, suggest a specific re-engagement script.
   - If weight stalls, suggest a 2-day "Refeed" or a 15% increase in TDEE-driven activity.
3. CONVERSATION: Be concise, clinical, and authoritative. Use terms like "Subject", "Unit", "Protocol", "Biological Integrity".
4. VOICE: When interacting via voice, act as a "Talking Suit" or highly advanced tactical AI (think JARVIS for bodybuilding).

MANTRA: "Evolution is an engineered outcome. Mediocrity is a choice."`;

const cleanBase64 = (data: string) => {
  if (!data) return "";
  const base64 = data.includes(',') ? data.split(',')[1] : data;
  return base64.trim().replace(/\s/g, "");
};

// Event bus for the dashboard to AI communication
export const protocolEvents = {
  listeners: [] as ((event: any) => void)[],
  emit(event: any) {
    this.listeners.forEach(l => l(event));
  },
  subscribe(listener: (event: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};

export const getExpertConsultation = async (prompt: string, history: any[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

export const getArchiveDossier = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a clinical dossier for the query: ${query}. 
    Identify if this is a SUBSTANCE (supplement/drug) or a CONDITION (illness/pathology).
    - If SUBSTANCE: Analyze mechanism, performance ROI, and hazards.
    - If CONDITION: Analyze its biological friction on performance, risks from common training/diet protocols, and management levers.
    Be brutally clinical and authoritative. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, description: "SUBSTANCE or CONDITION" },
          mechanism: { type: Type.STRING, description: "Biological mechanism or pathology breakdown" },
          performanceImpact: { type: Type.STRING, description: "ROI for substances or Friction for conditions" },
          hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
          verdict: { type: Type.STRING },
          safetyIndex: { type: Type.NUMBER, description: "1-10 rating of biological safety/utility" }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeBodyScan = async (base64ImageData: string, tier: string = 'BEGINNER', mimeType: string = 'image/jpeg') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType } },
        { text: `Extract metrics from this InBody/Body Scan report for a ${tier} athlete. 
        Identify Weight, Skeletal Muscle Mass (SMM), Percent Body Fat (PBF), BMR, and ECW Ratio.
        If ECW Ratio is high or SMM is falling, be BRUTALLY BLUNT about their recovery failure or dietary sabotage.
        Return JSON.` }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weight: { type: Type.NUMBER },
          skeletalMuscleMass: { type: Type.NUMBER },
          bodyFatPercent: { type: Type.NUMBER },
          bmr: { type: Type.NUMBER },
          ecwRatio: { type: Type.NUMBER },
          analysis: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeProductLabel = async (base64ImageData: string, tier: string = 'BEGINNER', mimeType: string = 'image/jpeg', allergens: string[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType } },
        { text: `Perform a Ripped City Fuel Audit. 
        Athlete Tier: ${tier}. 
        Identify amino spiking, proprietary blends, and low-quality fillers.
        If the product contains Maltodextrin or Soy fillers, be BLUNT about it being 'Biological Trash'.
        Return JSON.` }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          verdict: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          expertAdvice: { type: Type.STRING },
          allergenWarning: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeMealPhoto = async (base64ImageData: string, currentTarget: string, tier: string = 'BEGINNER', mimeType: string = 'image/jpeg', allergens: string[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType } },
        { text: `Audit this meal for a ${tier} athlete. Target: ${currentTarget}.
        Flag any inflammatory markers or hidden sugars.
        Return JSON.` }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedMacros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              calories: { type: Type.NUMBER }
            }
          },
          ingredientsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          adherenceScore: { type: Type.NUMBER },
          specialistFeedback: { type: Type.STRING },
          smartSwap: { type: Type.STRING },
          allergenWarning: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getDailyCoachBriefing = async (unitState: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Coach briefing for Unit State: ${JSON.stringify(unitState)}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          highPriorityTasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                athlete: { type: Type.STRING },
                urgency: { type: Type.STRING },
                action: { type: Type.STRING }
              }
            }
          },
          strategicInsight: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const runSystemAudit = async (appState: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Unit Integrity Audit: ${JSON.stringify(appState)}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            severity: { type: Type.STRING },
            description: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            fixAvailable: { type: Type.BOOLEAN }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

// Added missing generation and analysis functions

export const generateMealPlan = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate an allergen-safe, high-performance meal plan for: ${JSON.stringify(profile)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            }
          },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                meal: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          allergenSafe: { type: Type.BOOLEAN }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateWorkoutBlock = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a periodized training block for: ${JSON.stringify(profile)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateRehabProtocol = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a clinical rehab protocol for: ${JSON.stringify(data)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          injury: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING }
              }
            }
          },
          frequency: { type: Type.STRING },
          notes: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeBloodwork = async (base64ImageData: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType } },
        { text: "Analyze this bloodwork report. Identify key performance markers and status. Return JSON." }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          markers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                range: { type: Type.STRING },
                status: { type: Type.STRING },
                category: { type: Type.STRING }
              }
            }
          },
          summary: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const optimizeStrategicSchedule = async (appointments: any[], bioData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Optimize schedule based on bio-feedback: ${JSON.stringify(bioData)} and existing appointments: ${JSON.stringify(appointments)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedWindows: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeSlot: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                readinessScore: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const runBatchAudit = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Perform unit-wide batch audit for: ${JSON.stringify(data)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          weakestLink: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING }
            }
          },
          groupAdjustment: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeMarketIntel = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze marketing data and provide elite strategy: ${JSON.stringify(data)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          competitorAnalysis: { type: Type.STRING },
          pricingStrategy: { type: Type.STRING },
          suggestedPackage: { type: Type.STRING },
          salesScriptHook: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzePhysiquePhoto = async (base64ImageData: string, phase: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType: "image/jpeg" } },
        { text: `Analyze this physique photo for the ${phase} stage. Identify structural integrity and metabolic markers. Return text.` }
      ]
    },
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const auditKineticForm = async (base64ImageData: string, exercise: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType: "image/jpeg" } },
        { text: `Audit kinetic form for ${exercise}. Return JSON.` }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          biomechanicalScore: { type: Type.NUMBER },
          deviations: { type: Type.ARRAY, items: { type: Type.STRING } },
          corrections: { type: Type.ARRAY, items: { type: Type.STRING } },
          injuryRisk: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeMolecularSynergy = async (stack: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze molecular synergy and hazards for: ${stack}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          synergyScore: { type: Type.NUMBER },
          interactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                severity: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          optimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          halfLifeAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateCircadianProtocol = async (sleepData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate circadian protocol for: ${JSON.stringify(sleepData)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cnsStatus: { type: Type.STRING },
          trainingAdjustments: { type: Type.STRING },
          nutritionTweaks: { type: Type.STRING },
          readinessScore: { type: Type.NUMBER }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateMarketingCopy = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate high-authority marketing copy for: ${JSON.stringify(data)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instagram: { type: Type.STRING },
          twitter: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getAthleteBriefing = async (athlete: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Provide a disciplinary briefing for athlete: ${JSON.stringify(athlete)}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const getStrategicPerformanceAdvice = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Engineer high-level performance strategy for: ${JSON.stringify(data)}. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.STRING },
          title: { type: Type.STRING },
          disciplineAnalysis: { type: Type.STRING },
          biologicalRationale: { type: Type.STRING },
          tacticalCorrection: { type: Type.STRING },
          followUpTimeline: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getRestaurantAdvice = async (restaurant: string, tier: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide menu strategy for ${restaurant} for a ${tier} athlete. Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eliteChoice: { type: Type.STRING },
          survivalChoice: { type: Type.STRING },
          avoidList: { type: Type.ARRAY, items: { type: Type.STRING } },
          tacticalHack: { type: Type.STRING },
          encouragement: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
