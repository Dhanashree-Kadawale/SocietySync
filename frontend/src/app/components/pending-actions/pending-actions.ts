import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  pendingActions: PendingAction[] = [];

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.pendingActions = this.mockData.getPendingActions();
  }

  handleAction(action: PendingAction) {
    this.mockData.showToast({
      type: 'info',
      title: action.title,
      message: `Opening ${action.title} management panel`,
    });
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
