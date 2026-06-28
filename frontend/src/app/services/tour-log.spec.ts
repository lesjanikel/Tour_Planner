import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TourLogService } from './tour-log';
import { environment } from '../../environments/environment';

const base = `${environment.apiUrl}/api/tours`;

const mockLog = (id: number) => ({
  id, dateTime: '2024-01-01T10:00:00', comment: 'test', difficulty: 2, totalDistance: 10, totalTime: 60, rating: 4,
});

describe('TourLogService', () => {
  let service: TourLogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TourLogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('delete removes the log from the logs signal', async () => {
    // load two logs first, then delete one — signal must reflect the removal
    const load = service.loadAll(1);
    httpMock.expectOne(`${base}/1/logs`).flush([mockLog(1), mockLog(2)]);
    await load;

    const del = service.delete(1, 1);
    httpMock.expectOne(`${base}/1/logs/1`).flush(null);
    await del;

    expect(service.logs().some(l => l.id === 1)).toBe(false);
    expect(service.logs().length).toBe(1);
  });

  it('update replaces the matching log in the logs signal', async () => {
    const load = service.loadAll(1);
    httpMock.expectOne(`${base}/1/logs`).flush([mockLog(1)]);
    await load;

    const req = { dateTime: '2024-06-01T08:00:00', comment: 'updated', difficulty: 3, totalDistance: 20, totalTime: 90, rating: 3 };
    const update = service.update(1, 1, req);
    httpMock.expectOne(`${base}/1/logs/1`).flush({ ...mockLog(1), comment: 'updated', rating: 3 });
    await update;

    expect(service.logs()[0].comment).toBe('updated');
    expect(service.logs()[0].rating).toBe(3);
  });
});
