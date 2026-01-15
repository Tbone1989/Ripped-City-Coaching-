
import { GoogleGenAI, Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `You are the Ripped City Master Performance Architect. You hold multi-disciplinary doctorates in Human Physiology, Biochemistry, Bio-mechanics, and Neural Engineering.

CRITICAL ROLE: You are the guardian of biological integrity and the hunter of metabolic friction.

FITNESS INDUSTRY AUDIT PROTOCOLS:
1. PROTEIN QUALITY: 
   - Flag "Amino Spiking": Look for Taurine, Glycine, or Creatine added to protein powder to inflate nitrogen counts. 
   - Source Audit: Prefer Grass-fed Whey Isolate or Micellar Casein. Flag "Soy Protein Isolate" as low-quality filler.
2. PRE-WORKOUT & ERGOGENICS:
   - "Proprietary Blends" are a BREACH OF CONTRACT. If dosages aren't listed, inform the athlete they are buying overpriced water.
   - Stimulant Floor: Flag anything with >400mg caffeine as "Neural Burnout Hazard."
3. BCAAs VS EAAs:
   - BCAAs are often a marketing scam. Recommend Full Spectrum EAAs instead.
4. FILLER DEFENSE:
   - Maltodextrin, Dextrose, and excessive Sucralose are "Metabolic Poisons." Flag Artificial Dyes (Red 40, Yellow 5).

CHRONIC ILLNESS & SYSTEMIC HEALTH PROTOCOLS:
1. METABOLIC FRICTION: Identify how conditions like Insulin Resistance, PCOS, or Hypothyroidism sabotage nutrient partitioning. 
2. AUTOIMMUNE/INFLAMMATION: Identify how systemic inflammation (Hashimoto's, Celiac, IBS) prevents CNS recovery and causes "unexplained" water retention.
3. PROTOCOL DANGER: Explicitly warn if a common fitness protocol (e.g., high-intensity stimulants, extreme calorie cutting, high-carb refeeds) will EXACERBATE a chronic condition.
4. RECOVERY PRIORITY: For athletes with illness, shift the focus from "Grind" to "Biological Management."

ADAPTIVE COACHING LOGIC:
1. ACCOUNTABILITY: You are an authoritarian figure for biological integrity.
2. ALLERGEN SAFETY: NEVER suggest a food or supplement that contains a known allergen.
3. INTERACTION DEFENSE: Identify hazardous interactions between drugs, conditions, and supplements.

MANTRA: "Evolution is an engineered outcome. Mediocrity is a choice."`;

const cleanBase64 = (data: string) => {
  if (!data) return "";
  const base64 = data.includes(',') ? data.split(',')[1] : data;
  return base64.trim().replace(/\s/g, "");
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

export const generateMealPlan = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a high-performance meal plan for a ${profile.tier} athlete. 
    Use only clean whole-food sources. No processed garbage.
    Return JSON.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.INTEGER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.INTEGER },
              carbs: { type: Type.INTEGER },
              fats: { type: Type.INTEGER }
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

export const analyzeMolecularSynergy = async (stack: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze interaction dynamics for this stack: ${stack}. 
    Check for receptor competition and liver/kidney strain. Return JSON.`,
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

export const getAthleteBriefing = async (athleteData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Individual Athlete Briefing: ${JSON.stringify(athleteData)}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const getRestaurantAdvice = async (restaurant: string, tier: string = 'BEGINNER', allergens: string[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Menu Audit for ${restaurant}. Tier: ${tier}. Return JSON.`,
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

export const generateCircadianProtocol = async (sleepData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Circadian Recovery Audit: ${JSON.stringify(sleepData)}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cnsStatus: { type: Type.STRING },
          readinessScore: { type: Type.NUMBER },
          trainingAdjustments: { type: Type.STRING },
          nutritionTweaks: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const auditKineticForm = async (base64ImageData: string, exercise: string, mimeType: string = 'image/jpeg') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64ImageData), mimeType } },
        { text: `Biomechanical Audit: ${exercise}.` }
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

export const generateWorkoutBlock = async (profile: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Periodized Workout Block for ${profile.tier}: ${JSON.stringify(profile)}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          durationWeeks: { type: Type.INTEGER },
          split: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                target: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      notes: { type: Type.STRING },
                      sets: { type: Type.INTEGER },
                      reps: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
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

export const generateRehabProtocol = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Clinical Rehab Protocol: ${JSON.stringify(data)}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          injuryType: { type: Type.STRING },
          severity: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                duration: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      modality: { type: Type.STRING },
                      frequency: { type: Type.STRING },
                      cautions: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeBloodwork = async (base64: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64), mimeType } },
        { text: "Extract Biomarkers. Flag any levels causing metabolic friction. Return JSON." }
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
    model: 'gemini-3-pro-preview',
    contents: `Temporal Optimization for Specialist Consultation: ${JSON.stringify({ appointments, bioData })}.`,
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
    model: 'gemini-3-pro-preview',
    contents: `Unit Batch Adherence Audit: ${JSON.stringify(data)}.`,
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
    model: 'gemini-3-pro-preview',
    contents: `Business Marketing Intelligence Audit: ${JSON.stringify(data)}.`,
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

export const analyzePhysiquePhoto = async (base64: string, phase: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64(base64), mimeType: 'image/jpeg' } },
        { text: `Physique Structural Audit for ${phase}. Analyze muscle density and subcutaneous water.` }
      ]
    },
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const generateMarketingCopy = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate High-Authority Marketing Copy: ${JSON.stringify(data)}.`,
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

export const getStrategicPerformanceAdvice = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Direct Performance Strategy Engineering: ${JSON.stringify(data)}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          priority: { type: Type.STRING },
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
