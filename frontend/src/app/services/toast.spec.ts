import { TestBed } from '@angular/core/testing';
import { ToastService, extractError } from './toast';

describe('extractError', () => {
  it('uses error.detail when present', () => {
    expect(extractError({ error: { detail: 'Not found' } })).toBe('Not found');
  });

});

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('adds a toast to the list when show is called', () => {
    service.show('Hello', 'info');
    expect(service.toasts().some(t => t.message === 'Hello' && t.kind === 'info')).toBe(true);
  });

  it('removes a toast when dismiss is called with its id', () => {
    service.show('Bye', 'success');
    const id = service.toasts()[0].id;
    service.dismiss(id);
    expect(service.toasts().some(t => t.id === id)).toBe(false);
  });
});
