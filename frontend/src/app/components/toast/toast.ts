import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { ToastNotification } from '../../models/models';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
  constructor(public mockData: MockDataService) {}

  get toasts(): ToastNotification[] {
    return this.mockData.toasts();
  }

  dismiss(id: string) {
    this.mockData.removeToast(id);
  }

  getIcon(type: string): string {
    switch(type) {
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      case 'warning': return 'alert-triangle';
      default: return 'info';
    }
  }
}

export { Toast as ToastComponent };

