import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';

import { SocietyDoc } from '../../models/models';
export type { SocietyDoc };

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class DocumentsPageComponent implements OnInit {
  public mockData = inject(MockDataService);
  public authService = inject(AuthService, { optional: true });

  public documents = this.mockData.documents;

  // Filters
  public selectedCategory = signal<string>('ALL');
  public selectedFormat = signal<string>('ALL');
  public searchQuery = signal<string>('');

  // Modals
  public showUploadModal = signal<boolean>(false);
  public showPreviewModal = signal<boolean>(false);
  public previewDoc = signal<SocietyDoc | null>(null);

  // Upload Form
  public uploadForm: any = {
    title: '',
    category: 'Legal',
    format: 'PDF',
    fileSize: '1.5 MB',
    accessLevel: 'All Residents',
    description: '',
    fileName: ''
  };

  ngOnInit() {}

  public filteredDocuments = computed(() => {
    let docs = this.documents();
    const cat = this.selectedCategory();
    const fmt = this.selectedFormat();
    const q = this.searchQuery().toLowerCase().trim();

    if (cat !== 'ALL') {
      docs = docs.filter(d => d.category === cat);
    }

    if (fmt !== 'ALL') {
      docs = docs.filter(d => d.format === fmt);
    }

    if (q) {
      docs = docs.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
      );
    }

    return docs;
  });

  // Summary counts
  public totalDocsCount = computed(() => this.documents().length);
  public legalDocsCount = computed(() => this.documents().filter(d => d.category === 'Legal').length);
  public safetyDocsCount = computed(() => this.documents().filter(d => d.category === 'Safety').length);
  public financialDocsCount = computed(() => this.documents().filter(d => d.category === 'Financial').length);

  openUploadModal() {
    this.uploadForm = {
      title: '',
      category: 'Legal',
      format: 'PDF',
      fileSize: '1.8 MB',
      accessLevel: 'All Residents',
      description: '',
      fileName: 'society_circular_' + Math.floor(100 + Math.random() * 900) + '.pdf'
    };
    this.showUploadModal.set(true);
  }

  closeUploadModal() {
    this.showUploadModal.set(false);
  }

  submitUpload() {
    if (!this.uploadForm.title.trim()) {
      this.mockData.showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a document title'
      });
      return;
    }

    this.mockData.addDocument({
      title: this.uploadForm.title,
      category: this.uploadForm.category,
      format: this.uploadForm.format,
      fileSize: this.uploadForm.fileSize || '1.2 MB',
      accessLevel: this.uploadForm.accessLevel,
      description: this.uploadForm.description || 'Uploaded via Secretary Document Portal.'
    });
    this.closeUploadModal();
  }

  openPreview(doc: SocietyDoc) {
    this.previewDoc.set(doc);
    this.showPreviewModal.set(true);
  }

  closePreview() {
    this.showPreviewModal.set(false);
    this.previewDoc.set(null);
  }

  downloadDocument(doc: SocietyDoc, event?: Event) {
    if (event) event.stopPropagation();
    doc.downloadCount++;
    this.mockData.showToast({
      type: 'success',
      title: 'Downloading Document',
      message: `Preparing ${doc.title} (${doc.format}) for download...`
    });
  }

  shareDocument(doc: SocietyDoc, event?: Event) {
    if (event) event.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + '/documents#' + doc.id);
    this.mockData.showToast({
      type: 'info',
      title: 'Secure Link Copied',
      message: `Document share link for "${doc.title}" copied to clipboard.`
    });
  }

  deleteDocument(doc: SocietyDoc, event?: Event) {
    if (event) event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      this.mockData.deleteDocument(doc.id);
      if (this.previewDoc()?.id === doc.id) {
        this.closePreview();
      }
    }
  }
}
