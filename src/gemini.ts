/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { LifestyleForm, BehavioralVector, Room, StudentProfile } from "./domain/types.js";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDF-ORdB_NoBCSFMtBT_pOhQXuWq2uE5aE";

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});

export interface GeminiAnalysisResult {
  personality_vector: BehavioralVector;
  tags: string[];
}

export interface GeminiCompatibilityResult {
  compatibilityScore: number;
  conflictRisk: number;
  matchingNotes: string;
}

/**
 * Analyzes the student's lifestyle questionnaire using gemini-3.5-flash
 * with Schema restrictions to assert precise, type-checked JSON responses.
 */
export async function analyzeStudentLifestyle(answers: LifestyleForm): Promise<GeminiAnalysisResult> {
  const prompt = `Analyze this college student's lifestyle questionnaire answers to formulate a precise numerical behavioral vector (0-100 score) and characteristic tags.
Student answers:
- Sleep Schedule: ${answers.sleepSchedule}
- Cleanliness Level (1-5): ${answers.cleanlinessLevel}
- Noise Tolerance (1-5): ${answers.noiseTolerance}
- Smoking Preference: ${answers.smokingPreference}
- Social Level (1-5): ${answers.socialLevel}
- Gaming Habits: ${answers.gamingHabits}
- Study Habits: ${answers.studyHabits}
- Introvert/Extrovert scale (1=Introvert, 5=Extrovert): ${answers.introvertExtrovert}
- Conflict Tolerance (1-5): ${answers.conflictTolerance}
- Roommate Preference description: "${answers.preferredRoommateType}"

Calculate scores for:
1. social_score: how interactive they are.
2. discipline_score: focus on rules, sleep structure, and studies.
3. cleanliness_score: converted cleanliness level from 1-5 scalar to 0-100.
4. noise_tolerance: noise tolerance mapped up to 100 max.
5. night_activity_score: how active they are during typical sleep hours based on gaming, bedtime owl schedules, block study modes.

Generate 3-4 characteristics tags (all lowercase, hyphenated e.g. "night-owl", "studious", "quiet-resident").`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional industrial psychologist and housing compliance analyzer at a multi-dorm university residence SaaS. Provide precise numerical profiles.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["personality_vector", "tags"],
          properties: {
            personality_vector: {
              type: Type.OBJECT,
              required: ["social_score", "discipline_score", "cleanliness_score", "noise_tolerance", "night_activity_score"],
              properties: {
                social_score: { type: Type.INTEGER, description: "A score from 0 to 100 for student social behavior." },
                discipline_score: { type: Type.INTEGER, description: "A score from 0 to 100 for student study and rules discipline." },
                cleanliness_score: { type: Type.INTEGER, description: "A score from 0 to 100 for student cleanliness." },
                noise_tolerance: { type: Type.INTEGER, description: "A score from 0 to 100 for student noise tolerance." },
                night_activity_score: { type: Type.INTEGER, description: "A score from 0 to 100 for late night activity." }
              }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 characteristic tags describing the student lifestyle profile."
            }
          }
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text) as GeminiAnalysisResult;
  } catch (err) {
    console.error("Gemini lifestyle analysis failed. Using math fallback:", err);
    // Highly robust fallback calculator if Gemini API is throttled or missing keys
    const cleanliness_score = Math.min(Math.max(answers.cleanlinessLevel * 20, 0), 100);
    const noise_tolerance = Math.min(Math.max(answers.noiseTolerance * 20, 0), 100);
    const social_score = Math.min(Math.max(answers.socialLevel * 20, 0), 100);
    const night_activity_score = answers.sleepSchedule === "night-owl" ? 85 : answers.sleepSchedule === "early-bird" ? 20 : 50;
    const discipline_score = answers.studyHabits === "solo-quiet" ? 80 : 50;

    const tags = [
      answers.sleepSchedule,
      answers.gamingHabits === "frequent" ? "gamer" : "casual-user",
      answers.cleanlinessLevel >= 4 ? "tidiness-oriented" : "relaxed-profile"
    ];

    return {
      personality_vector: {
        social_score,
        discipline_score,
        cleanliness_score,
        noise_tolerance,
        night_activity_score
      },
      tags
    };
  }
}

/**
 * Explains and validates the compatibility between an applicant student form
 * and current room residents (or empty room style expectations).
 */
export async function explainRoomCompatibility(
  applicant: { name: string; answers: LifestyleForm; vector?: BehavioralVector },
  room: Room,
  residents: StudentProfile[]
): Promise<GeminiCompatibilityResult> {
  const residentTexts = residents.map((r, i) => {
    return `Resident ${i + 1} lifestyle answers: ${JSON.stringify(r.lifestyleAnswers)}, tags: ${JSON.stringify(r.tags)}`;
  }).join("\n");

  const prompt = `Assess the roommate compatibility and potential conflicts between an applicant and existing residents of room ${room.roomNumber} (Capacity: ${room.capacity}).
Applicant Name: ${applicant.name}
Applicant lifestyle Answers: ${JSON.stringify(applicant.answers)}

Existing Residents in Room (${room.occupancy}/${room.capacity}):
${residents.length === 0 ? "This room is currently empty. Compare applicant expectations to general dorm structures." : residentTexts}

Analyze conflicts on:
1. Sleep schedule overlap (e.g. night-owl vs early-bird conflicts).
2. Cleanliness friction (tidy vs messy).
3. Socializing/noise vs peace expectations.
4. Smoking mismatch (this is a CRITICAL conflict; smoker and non-smoker should trigger heavily lower score and high risk).

Output a numeric compatibility score (0 to 100), a conflict risk percentage (0 to 100), and a concise, explainable matching review notes statement.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert student housing allocation advisor. Provide structured, fair, and high-quality reviews.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["compatibilityScore", "conflictRisk", "matchingNotes"],
          properties: {
            compatibilityScore: { type: Type.INTEGER, description: "A calculated score from 0 (terrible) to 100 (excellent)." },
            conflictRisk: { type: Type.INTEGER, description: "Estimated conflict friction probability from 0% to 100%." },
            matchingNotes: { type: Type.STRING, description: "A detailed explanation of why they fit, highlight issues (e.g. sleep/noise) if any." }
          }
        }
      }
    });

    const text = response.text || "";
    return JSON.parse(text) as GeminiCompatibilityResult;
  } catch (err) {
    console.error("Gemini room compatibility calculation failed, backing up to rule-based analysis:", err);
    // Weighted deterministic formula fallback if Gemini is offline
    if (residents.length === 0) {
      return {
        compatibilityScore: 90,
        conflictRisk: 5,
        matchingNotes: "Allocated to empty room. Applicant expectations match general building rules perfectly."
      };
    }

    let totalScore = 0;
    let totalRisk = 0;

    for (const resident of residents) {
      let score = 100;
      let risk = 0;

      // Sleep conflict
      if (applicant.answers.sleepSchedule !== resident.lifestyleAnswers.sleepSchedule) {
        if (
          (applicant.answers.sleepSchedule === "early-bird" && resident.lifestyleAnswers.sleepSchedule === "night-owl") ||
          (applicant.answers.sleepSchedule === "night-owl" && resident.lifestyleAnswers.sleepSchedule === "early-bird")
        ) {
          score -= 25;
          risk += 35;
        } else {
          score -= 10;
          risk += 15;
        }
      }

      // Cleanliness conflict
      const cleanDiff = Math.abs(applicant.answers.cleanlinessLevel - resident.lifestyleAnswers.cleanlinessLevel);
      score -= cleanDiff * 8;
      risk += cleanDiff * 12;

      // Smoking conflict (CRITICAL)
      if (
        (applicant.answers.smokingPreference === "smoker" && resident.lifestyleAnswers.smokingPreference === "non-smoker") ||
        (applicant.answers.smokingPreference === "non-smoker" && resident.lifestyleAnswers.smokingPreference === "smoker")
      ) {
        score -= 40;
        risk += 60;
      }

      // Social level differences
      const socialDiff = Math.abs(applicant.answers.socialLevel - resident.lifestyleAnswers.socialLevel);
      score -= socialDiff * 5;
      risk += socialDiff * 8;

      totalScore += score;
      totalRisk += risk;
    }

    const avgScore = Math.max(0, Math.min(Math.round(totalScore / residents.length), 100));
    const avgRisk = Math.max(0, Math.min(Math.round(totalRisk / residents.length), 100));

    return {
      compatibilityScore: avgScore,
      conflictRisk: avgRisk,
      matchingNotes: `Evaluated programmatically with a score of ${avgScore}% compatibility and ${avgRisk}% conflict risk estimation based on lifestyle differentials.`
    };
  }
}
