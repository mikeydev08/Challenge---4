/* ═══════════════════════════════════════════════════════
   StadiumMind AI — AI Response Types
   ═══════════════════════════════════════════════════════ */

export interface AIInsight {
  priority: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  reasoning: string;
  suggestedAction: string;
  affectedZones: string[];
}

export interface CommandCenterAIResponse {
  insights: AIInsight[];
}

export interface AnnouncementTranslations {
  translations: Record<string, string>;
}

export interface FanCompanionMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AccessibilitySceneDescription {
  description: string;
  hazards: string[];
  accessibilityFeatures: string[];
  navigationHints: string[];
}
