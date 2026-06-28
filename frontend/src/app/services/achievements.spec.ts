import { AchievementsService } from './achievements';
import { Tour } from '../models/tour';

function makeTour(overrides: Partial<Tour> = {}): Tour {
  return {
    id: 1, name: 'T', description: '', fromName: '', fromLat: 0, fromLon: 0,
    toName: '', toLat: 0, toLon: 0, transportType: 'FOOT_WALKING',
    distanceKm: 0, durationSec: 0, routeGeoJson: null, imageUrl: null,
    ownerId: 1, popularity: 0, childFriendly: null, ...overrides,
  };
}

describe('AchievementsService', () => {
  let service: AchievementsService;
  beforeEach(() => { service = new AchievementsService(); });

  it('returns no achievements for an empty tour list', () => {
    expect(service.getAchievements([])).toEqual([]);
  });

  it('awards a tour count achievement based on number of tours', () => {
    expect(service.getAchievements([makeTour()]).some(a => a.title === 'First Tour Completed')).toBe(true);
  });

  it('awards a transport achievement when multiple transport types are used', () => {
    const tours = [makeTour({transportType: 'FOOT_WALKING'}), makeTour({transportType: 'DRIVING_CAR'})];
    expect(service.getAchievements(tours).some(a => a.title === 'Multi-Transport Traveller')).toBe(true);
  });
});
