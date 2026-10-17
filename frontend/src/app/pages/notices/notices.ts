import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Notice } from '../../models/models';

@Component({
  selector: 'app-notices-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.html',
  styleUrl: './notices.css'
})
export class NoticesPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public notices = signal<Notice[]>([]);
  public searchQuery = signal<string>('');
  public selectedType = signal<string>('ALL');

  public showCreateModal = signal<boolean>(false);

  public noticeForm = {
    title: '',
    content: '',
    type: 'General' as 'General' | 'Urgent' | 'Maintenance' | 'Event',
    isPinned: false
  };

  ngOnInit() {
    this.notices.set(this.mockData.getNotices());
  }

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
    const newNot: Notice = {
      id: `NOT-00${this.notices().length + 1}`,
      title: this.noticeForm.title,
      content: this.noticeForm.content,
      type: this.noticeForm.type,
      postedBy: 'Rahul Verma (Secretary)',
      postedAt: new Date().toISOString(),
      isPinned: this.noticeForm.isPinned
    };

    this.notices.update(prev => [newNot, ...prev]);
    this.mockData.showToast({
      type: 'success',
      title: 'Notice Published',
      message: `"${newNot.title}" broadcasted to all residents.`
    });
    this.closeCreateModal();
  }

  togglePin(n: Notice) {
    this.notices.update(prev =>
      prev.map(item => item.id === n.id ? { ...item, isPinned: !item.isPinned } : item)
    );
    this.mockData.showToast({
      type: 'info',
      title: 'Pin Toggled',
      message: `Notice #${n.id} ${n.isPinned ? 'unpinned from' : 'pinned to'} top of board.`
    });
  }

  deleteNotice(n: Notice) {
    if (confirm(`Delete notice "${n.title}"?`)) {
      this.notices.update(prev => prev.filter(item => item.id !== n.id));
      this.mockData.showToast({
        type: 'info',
        title: 'Notice Removed',
        message: 'Announcement deleted.'
      });
    }
  }
}
