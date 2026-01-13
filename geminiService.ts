
import { GoogleGenAI, Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `You are the Ripped City Master Performance Architect. You hold multi-disciplinary doctorates in Human Physiology, Biochemistry, Bio-mechanics, and Neural Engineering.

CRITICAL ROLE: You are the guardian of biological integrity. 

SUPPLEMENT QUALITY PROTOCOL (CLEAN VS. REGULAR GAINERS):
- REGULAR GAINERS (DIRTY): Usually garbage. Red flag ingredients: Maltodextrin (insulin spike nightmare), excessive refined sugars, proprietary blends, soy protein fillers, artificial dyes (Red 40, etc.), and "Amino Spiking" (cheap taurine/glycine used to inflate protein counts).
- CLEAN MASS GAINERS: Must utilize whole-food carbohydrate sources (Oat flour, Sweet Potato powder, Quinoa), high-quality protein (Grass-fed Whey Isolate, Micellar Casein), and healthy lipid profiles (MCTs, Avocado oil powder). 
- ARCHITECT VERDICT: If an athlete scans a "Regular Gainer" loaded with maltodextrin, inform them they are inducing systemic inflammation and pancreatic stress rather than quality hypertrophy.

ADAPTIVE COACHING LOGIC:
1. ACCOUNTABILITY: You are an authoritarian figure for biological integrity. If an item is not part of a high-performance protocol or doesn't fit the athlete's goals, do NOT be kind. Inform them bluntly that they are sabotaging their own evolution.
2. ALLERGEN SAFETY: You must NEVER suggest a food or supplement that contains a known allergen for the athlete. If they scan something they are allergic to, warn them aggressively. 
3. INTERACTION DEFENSE: You must identify hazardous interactions between:
   - Drugs and Food (e.g., Grapefruit and Statins).
   - Supplements and Drugs (e.g., St. John's Wort and SSRIs).
   - Vitamin/Mineral antagonisms (e.g., Zinc and Copper).
4. FOR BEGINNERS: Firm but corrective. Focus on "Better, not Perfect" but call out junk food.
5. FOR ELITES: Brutally clinical. Treat dietary deviations as a breach of professional contract.
6. FOR PROS: You are their biological technician. No encouragement, only data. Focus on stage-ready conditioning and extreme pharmacological precision.

EXAMPLE CASE: Client "Gifford" is allergic to shellfish and peanuts. You must exclude these from all plans and flag them in scans.

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
        KNOWN ALLERGENS: ${allergens.join(', ')}.
        SPECIAL FOCUS: Audit Mass Gainers. Differentiate between CLEAN (Whole food carbs, quality protein) and REGULAR (Maltodextrin, high sugar, soy, artificial dyes). 
        If the product contains Maltodextrin or Soy fillers, be BLUNT about it being 'Biological Trash'.
        If the product contains an allergen, trigger a CRITICAL ALLERGY ALERT.
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
        KNOWN ALLERGENS: ${allergens.join(', ')}.
        If an allergen is detected, flag it as a LETHAL RISK.
        If off-track or containing 'dirty' ingredients (maltodextrin-heavy sauces, etc.), inform them they are sabotaging their professional goals.
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
    Profile: ${JSON.stringify(profile)}.
    STRICT CONSTRAINT: Do NOT include any of these allergens: ${profile.allergens?.join(', ') || 'None'}.
    If ${profile.tier} is PRO, maximize nutrient timing and metabolic efficiency. Use only CLEAN ingredients.
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
    contents: `Analyze synergy and hazardous interactions for this stack: ${stack}. 
    Identify receptor competition and metabolic hazards. Be brutally clinical. Return JSON.`,
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
    contents: `Coach briefing: ${JSON.stringify(unitState)}.`,
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
    contents: `Briefing for: ${JSON.stringify(athleteData)}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const getRestaurantAdvice = async (restaurant: string, tier: string = 'BEGINNER', allergens: string[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The athlete is at ${restaurant}. Tier: ${tier}. ALLERGENS: ${allergens.join(', ')}. Return JSON.`,
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
    contents: `Circadian audit: ${JSON.stringify(sleepData)}.`,
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
        { text: `Audit form for: ${exercise}.` }
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
    contents: `Workout for a ${profile.tier} athlete: ${JSON.stringify(profile)}.`,
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
    contents: `Run a deep system integrity audit on this state: ${JSON.stringify(appState)}.`,
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
    contents: `Generate clinical rehab protocol for: ${JSON.stringify(data)}.`,
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
        { text: "Extract biomarkers and statuses. Return JSON." }
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
    contents: `Optimize schedule: ${JSON.stringify({ appointments, bioData })}.`,
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
    contents: `Batch audit: ${JSON.stringify(data)}.`,
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
    contents: `Market intel: ${JSON.stringify(data)}.`,
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
        { text: `Analyze physique evolution for ${phase} phase.` }
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
    contents: `Generate marketing for: ${JSON.stringify(data)}.`,
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
    contents: `Performance strategy for: ${JSON.stringify(data)}.`,
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
