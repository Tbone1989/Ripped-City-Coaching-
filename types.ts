
export enum UserRole {
  PROSPECT = 'PROSPECT',
  CLIENT = 'CLIENT',
  COACH = 'COACH'
}

export type ExperienceTier = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | 'PRO';

export enum BiologicalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY'
}

export type AthleticDiscipline = 
  | 'BODYBUILDING' 
  | 'POWERLIFTING' 
  | 'ENDURANCE' 
  | 'COMBAT' 
  | 'TEAM_SPORTS' 
  | 'TACTICAL' 
  | 'LIFESTYLE';

export interface SetRecord {
  weight: string;
  reps: string;
  completed: boolean;
  rpe?: number;
}

export interface Exercise {
  id: string;
  name: string;
  notes: string;
  sets: SetRecord[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  totalVolume: number;
  durationMinutes: number;
  architectRating: 'SUPERIOR' | 'OPTIMAL' | 'DEVIATING';
}

export interface HabitTask {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  tier: ExperienceTier;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'ONBOARDING';
  goal: string;
  timestamp: string;
  allergens?: string[];
}

export interface MealScanResult {
  estimatedMacros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  ingredientsDetected: string[];
  adherenceScore: number;
  specialistFeedback: string;
  smartSwap?: string;
  allergenWarning?: string;
}

export interface BodyScanMetrics {
  weight: number;
  skeletalMuscleMass: number;
  bodyFatPercent: number;
  bmr: number;
  ecwRatio: number; 
  date: string;
  analysis?: string;
}

export interface Unit {
  id: string;
  name: string;
  integrityScore: number;
  memberCount: number;
  focus: string;
}

export interface PerformanceAdvice {
  id: string;
  title: string;
  content: string;
  discipline: AthleticDiscipline;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface TeamAthlete {
  id: string;
  name: string;
  discipline: AthleticDiscipline;
  tier: ExperienceTier;
  adherence: number;
  status: 'OPTIMAL' | 'DEVIATING' | 'CRITICAL';
  lastCheckin: string;
  criticalMetric: string;
  performanceMetrics?: Record<string, string | number>;
  allergens?: string[];
  currentProtocol?: {
    kcal: number;
    p: number;
    c: number;
    f: number;
    supps: string[];
  };
}

export interface DashboardEvent {
  type: 'UPDATE_MACROS' | 'UPDATE_WORKOUT' | 'VIEW_STATS' | 'ADD_NOTE' | 'SYSTEM_ALERT';
  subject: string;
  details: string;
  timestamp: string;
}

export interface Anomaly {
  id: string;
  type: 'CLINICAL' | 'INTEGRITY' | 'TECHNICAL' | 'ALLERGY_RISK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  timestamp: string;
  fixAvailable: boolean;
}

export interface BloodMarker {
  name: string;
  value: number;
  unit: string;
  range: string;
  status: 'OPTIMAL' | 'NORMAL' | 'ALERT' | 'CRITICAL';
  category: 'HORMONAL' | 'METABOLIC' | 'LIPID' | 'ORGAN_HEALTH';
}

export interface ProtocolItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  type: 'SUPPLEMENT' | 'INJECTION' | 'MEDICATION' | 'HABIT';
  completed: boolean;
}

export interface HormonalData {
  sex: BiologicalSex;
  phase?: 'FOLLICULAR' | 'OVULATORY' | 'LUTEAL' | 'MENSTRUAL' | 'POST_MENOPAUSAL';
  androgenStatus?: 'OPTIMAL' | 'SUPPRESSED' | 'ELEVATED';
  estrogenStatus?: 'OPTIMAL' | 'DOMINANT' | 'LOW';
  symptoms: string[];
  lastMarkerUpdate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'REMINDER' | 'ALERT' | 'SUCCESS' | 'ALLERGY_WATCH';
  timestamp: string;
  read: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  date: string;
  description: string;
  paymentMethod?: string;
  recurring?: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  time: string;
  type: 'STRATEGY' | 'CONSULTATION';
  status: 'SCHEDULED' | 'TENTATIVE' | 'SYNCED';
}

export interface MealPlan {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  schedule: {
    time: string;
    meal: string;
    ingredients: string[];
  }[];
  allergenSafe: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  phase: string;
  systemAnalysis?: string;
}

export interface LandingPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  beforeImage: string;
  afterImage: string;
  methodology: {
    step: string;
    title: string;
    text: string;
    icon: string;
  }[];
  testimonials: {
    name: string;
    role: string;
    text: string;
    avatar: string;
  }[];
}

// Added missing types for various UI modules
export interface RehabProtocol {
  injury: string;
  exercises: { name: string; sets: string; reps: string }[];
  frequency: string;
  notes: string;
}

export interface MarketInsight {
  competitorAnalysis: string;
  pricingStrategy: string;
  suggestedPackage: string;
  salesScriptHook: string;
}

export interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  phase: 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATORY' | 'LUTEAL';
  symptoms: string[];
}

export interface FormAuditResult {
  biomechanicalScore: number;
  deviations: string[];
  corrections: string[];
  injuryRisk: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface MolecularSynergyReport {
  synergyScore: number;
  interactions: { type: string; severity: 'LOW' | 'MODERATE' | 'SEVERE'; description: string }[];
  optimizationTips: string[];
  halfLifeAlerts: string[];
}
