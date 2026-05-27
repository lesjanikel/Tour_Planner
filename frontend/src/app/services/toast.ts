import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  kind: 'error' | 'success' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, kind: Toast['kind'] = 'info', durationMs = 4000) {
    const id = this.nextId++;
    this.toasts.update(t => [...t, { id, message, kind }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  error(message: string)   { this.show(message, 'error'); }
  success(message: string) { this.show(message, 'success'); }
  info(message: string)    { this.show(message, 'info'); }

  dismiss(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}

export function extractError(err: any, fallback = 'Something went wrong'): string {
  return err?.error?.detail ?? err?.message ?? fallback;
}
