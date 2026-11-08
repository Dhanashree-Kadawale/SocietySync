import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { PendingAction } from '../../models/models';

@Component({
  selector: 'app-pending-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-actions.html',
  styleUrl: './pending-actions.css'
})
export class PendingActionsComponent implements OnInit {
  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {}

  get pendingActions(): PendingAction[] {
    return this.mockData.getPendingActions();
  }

  handleAction(action: PendingAction) {
    const routeMap: Record<string, string> = {
      resident_approval: '/residents',
      unassigned_complaint: '/complaints',
      overdue_payment: '/billing',
      pending_booking: '/facilities',
    };
    const target = routeMap[action.type] || '/dashboard';
    this.mockData.showToast({
      type: 'info',
      title: action.title,
      message: `Opening ${action.title}...`,
    });
    this.router.navigate([target]);
  }

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = {
      high: '#DC4545',
      medium: '#F9CE60',
      low: '#1D5245',
    };
    return map[priority] || '#71948F';
  }

  getPriorityBg(priority: string): string {
    const map: Record<string, string> = {
      high: '#fdf1f1',
      medium: '#fef8eb',
      low: '#edf4f2',
    };
    return map[priority] || '#F9FAF9';
  }
}
