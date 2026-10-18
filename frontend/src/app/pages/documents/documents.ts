import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

export interface SocietyDoc {
  id: string;
  title: string;
  category: 'Legal' | 'AGM' | 'Financial' | 'Safety' | 'Forms';
  format: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  accessLevel: 'All Residents' | 'Committee Only' | 'Confidential';
  description: string;
  downloadCount: number;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class DocumentsPageComponent implements OnInit {
  public mockData = inject(MockDataService);

  public documents = signal<SocietyDoc[]>([
    {
      id: 'DOC-001',
      title: 'Society Registered Bye-Laws & Code of Conduct (Amended 2024)',
      category: 'Legal',
      format: 'PDF',
      fileSize: '4.2 MB',
      uploadedAt: '12 Jan 2025',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: 'All Residents',
      description: 'Official registered bylaws of Greenwood Heights CHS registered under MCS Act with 2024 amendments.',
      downloadCount: 342
    },
    {
      id: 'DOC-002',
      title: 'Annual General Body Meeting (AGM) Minutes — September 2026',
      category: 'AGM',
      format: 'PDF',
      fileSize: '1.8 MB',
      uploadedAt: '25 Sep 2026',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: 'All Residents',
      description: 'Proceedings, resolutions passed, maintenance hike discussion, and elections of new managing committee.',
      downloadCount: 189
    },
    {
      id: 'DOC-003',
      title: 'Statutory Financial Audit Report & Balance Sheet FY 2025-26',
      category: 'Financial',
      format: 'PDF',
      fileSize: '3.6 MB',
      uploadedAt: '10 Aug 2026',
      uploadedBy: 'Sunil Joshi & Associates (CA)',
      accessLevel: 'All Residents',
      description: 'Audited balance sheet, income & expenditure account, sinking fund report, and auditor notes.',
      downloadCount: 154
    },
    {
      id: 'DOC-004',
      title: 'Municipal Fire Safety & Equipment Inspection Certificate (NOC)',
      category: 'Safety',
      format: 'PDF',
      fileSize: '950 KB',
      uploadedAt: '04 Oct 2026',
      uploadedBy: 'CFO Fire Brigade Dept',
      accessLevel: 'All Residents',
      description: 'Annual fire safety audit clearance valid till October 2027 covering all 4 towers and basement.',
      downloadCount: 88
    },
    {
      id: 'DOC-005',
      title: 'Lift Safety & Hydronic Inspection Clearance — Otis Elevators',
      category: 'Safety',
      format: 'PDF',
      fileSize: '1.1 MB',
      uploadedAt: '02 Oct 2026',
      uploadedBy: 'Otis Elevators India',
      accessLevel: 'All Residents',
      description: 'Quarterly maintenance test certification and wire-rope tensile test clearance.',
      downloadCount: 62
    },
    {
      id: 'DOC-006',
      title: 'Standard Flat Renovation & Interior Work Application (NOC Form)',
      category: 'Forms',
      format: 'DOCX',
      fileSize: '240 KB',
      uploadedAt: '15 Jul 2026',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: 'All Residents',
      description: 'Mandatory form to be submitted 7 days prior to commencing civil or heavy carpentry interior work.',
      downloadCount: 215
    },
    {
      id: 'DOC-007',
      title: 'Tenant Police Verification & Move-In Undertaking Packet',
      category: 'Forms',
      format: 'PDF',
      fileSize: '680 KB',
      uploadedAt: '15 Jul 2026',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: 'All Residents',
      description: 'Includes tenant agreement submission checklist, security deposit receipt, and police NOC acknowledgement.',
      downloadCount: 310
    },
    {
      id: 'DOC-008',
      title: 'Quarterly Budget & Major Expense Ledger Q2 (July - Sept 2026)',
      category: 'Financial',
      format: 'XLSX',
      fileSize: '820 KB',
      uploadedAt: '05 Oct 2026',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: 'Committee Only',
      description: 'Itemized vendor payouts, diesel expense logs, clubhouse upkeep, and electricity bills ledger.',
      downloadCount: 42
    },
    {
      id: 'DOC-009',
      title: 'Water Potability & Borewell Chemical Analysis Report',
      category: 'Safety',
      format: 'PDF',
      fileSize: '1.4 MB',
      uploadedAt: '28 Aug 2026',
      uploadedBy: 'State Public Health Lab',
      accessLevel: 'All Residents',
      description: 'Bacteriological and TDS lab tests confirming overhead water reservoir purity meets IS 10500 standards.',
      downloadCount: 76
    },
    {
      id: 'DOC-010',
      title: 'Managing Committee Special Meeting #18 Resolutions (Confidential)',
      category: 'AGM',
      format: 'PDF',
      fileSize: '510 KB',
      uploadedAt: '01 Oct 2026',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: 'Confidential',
      description: 'Deliberations on boundary wall encroachment matter and legal counsel appointment.',
      downloadCount: 9
    }
  ]);

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

    const newDoc: SocietyDoc = {
      id: 'DOC-0' + (this.documents().length + 1),
      title: this.uploadForm.title,
      category: this.uploadForm.category,
      format: this.uploadForm.format,
      fileSize: this.uploadForm.fileSize || '1.2 MB',
      uploadedAt: 'Today, Just Now',
      uploadedBy: 'Rahul Verma (Secretary)',
      accessLevel: this.uploadForm.accessLevel,
      description: this.uploadForm.description || 'Uploaded via Secretary Document Portal.',
      downloadCount: 0
    };

    this.documents.update(docs => [newDoc, ...docs]);
    this.closeUploadModal();
    this.mockData.showToast({
      type: 'success',
      title: 'Document Uploaded',
      message: `"${newDoc.title}" is now archived and accessible.`
    });
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
      this.documents.update(docs => docs.filter(d => d.id !== doc.id));
      this.mockData.showToast({
        type: 'warning',
        title: 'Document Archived',
        message: `"${doc.title}" has been removed from active repository.`
      });
      if (this.previewDoc()?.id === doc.id) {
        this.closePreview();
      }
    }
  }
}
