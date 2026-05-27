import { Injectable } from '@angular/core';
import { Achievement } from '../models/achievement';
import { Tour } from '../models/tour';

@Injectable({providedIn: 'root'})
export class AchievementsService {

  getAchievements(tours: Tour[]): Achievement[] {

    const achievements: Achievement[] = [];

    const totalDistance = tours.reduce((sum, t) => sum + t.distanceKm, 0);
    const totalTime = tours.reduce((sum, t) => sum + t.durationSec/60, 0);
    const longestTour = Math.max(...tours.map(t => t.distanceKm), 0);
    const transportTypes = new Set(tours.map(t => t.transportType));

    if (tours.length >= 10) {
      achievements.push({title: 'Tour Master', icon: '👑'});
    } else if (tours.length >= 5) {
      achievements.push({title: 'Experienced Traveller', icon: '🧭'});
    } else if (tours.length >= 1) {
      achievements.push({title: 'First Tour Completed', icon: '🎉'});
    }

    if (totalDistance >= 500) {
      achievements.push({title: 'World Explorer', icon: '🌍'});
    } else if (totalDistance >= 200) {
      achievements.push({title: 'Road Legend', icon: '🚴'});
    } else if (totalDistance >= 100) {
      achievements.push({title: '100 km Completed', icon: '🥾'});
    } else if (totalDistance >= 50) {
      achievements.push({title: 'Long Distance Traveller', icon: '🚶'});
    }

    if (totalTime >= 1200) {
      achievements.push({title: 'Travel Veteran', icon: '⏳'});
    } else if (totalTime >= 600) {
      achievements.push({title: 'Time Master', icon: '⏱️'});
    } else if (totalTime >= 300) {
      achievements.push({title: 'Time Explorer', icon: '🕒'});
    }

    if (longestTour >= 50) {
      achievements.push({title: 'Extreme Route', icon: '🏔️'});
    } else if (longestTour >= 25) {
      achievements.push({title: 'Marathon Tour', icon: '🏅'});
    }

    if (transportTypes.size >= 4) {
      achievements.push({title: 'Transport Master', icon: '🚆'});
    } else if (transportTypes.size >= 2) {
      achievements.push({title: 'Multi-Transport Traveller', icon: '🗺️'});
    }

    return achievements;
  }
}
