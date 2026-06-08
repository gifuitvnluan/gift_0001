/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoveOrbitConfig {
  id: string;
  text: string;
  radius: number;
  speed: number; // Angular speed
  color: string;
  tiltX: number; // Tilt in degrees
  tiltZ: number; // Tilt in degrees
  direction: 1 | -1; // 1: clockwise, -1: counter-clockwise
}

export interface FloatingItem {
  id: string;
  type: "petal" | "heart" | "sparkle";
  x: number;
  y: number;
  z: number;
  scale: number;
  speedY: number;
  speedRot: number;
  phase: number;
}

export interface LoveMemory {
  id: string;
  title: string;
  date: string;
  content: string;
  emoji: string;
}

export interface LoveConfig {
  loverName: string;
  headline: string;
  introText: string;
  musicUrl: string;
  letterTitle: string;
  letterBody: string;
  memories: LoveMemory[];
}
