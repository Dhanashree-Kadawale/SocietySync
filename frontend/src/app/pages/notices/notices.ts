import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';
import { Notice } from '../../models/models';

@Component({
  selector: 'app-notices-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.html',
  styleUrl: './notices.css'
})
export class NoticesPageComponent {
  public mockData = inject(MockDataService);
  public authService = inject(AuthService, { optional: true });

  public notices = this.mockData.notices;
  public searchQuery = signal<string>('');
  public selectedType = signal<string>('ALL');

  public showCreateModal = signal<boolean>(false);

  public noticeForm = {
    title: '',
    content: '',
    type: 'General' as 'General' | 'Urgent' | 'Maintenance' | 'Event',
    isPinned: false
  };

  public filteredNotices = computed(() => {
    let list = this.notices();
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();

    if (q) {
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }
    if (type !== 'ALL') list = list.filter(n => n.type === type);
    return list;
  });

  public urgentCount = computed(() => this.notices().filter(n => n.type === 'Urgent').length);
  public pinnedCount = computed(() => this.notices().filter(n => n.isPinned).length);

  openCreateModal() {
    this.noticeForm = {
      title: '',
      content: '',
      type: 'General',
      isPinned: false
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  saveNotice() {
    if (!this.noticeForm.title || !this.noticeForm.content) return;
    this.mockData.addNotice({
      title: this.noticeForm.title,
      content: this.noticeForm.content,
      type: this.noticeForm.type,
      isPinned: this.noticeForm.isPinned
    });
    this.closeCreateModal();
  }

  togglePin(n: Notice) {
    this.mockData.addNotice({
      ...n,
      isPinned: !n.isPinned
    });
  }

  deleteNotice(n: Notice) {
    if (confirm(`Delete notice "${n.title}"?`)) {
      this.mockData.deleteNotice(n.id);
    }
  }
}
