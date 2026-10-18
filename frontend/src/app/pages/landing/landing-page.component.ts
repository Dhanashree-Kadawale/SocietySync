import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  mobileMenuOpen = signal<boolean>(false);
  contactSubmitted = signal<boolean>(false);
  toastMessage = signal<string | null>(null);

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  features = [
    {
      icon: 'payment',
      title: 'Maintenance & Payments',
      tag: 'FINANCIAL TRANSPARENCY',
      description:
        'Automated recurring society dues calculation, instant online payment via UPI, Cards, and Net Banking with immediate verifiable digital receipts.',
      linkText: 'Explore Payments'
    },
    {
      icon: 'complaint',
      title: 'Complaint Management',
      tag: 'RAPID RESOLUTION',
      description:
        'Register plumbing, electrical, and elevator concerns. Track real-time progress through assignment, work notes, and repair photo verification.',
      linkText: 'Track Complaints'
    },
    {
      icon: 'visitor',
      title: 'Visitor Management',
      tag: 'GATE SECURITY',
      description:
        'Pre-approve expected guests, couriers, and cabs with digital entry passcodes. Approve or deny gate arrivals directly from your device.',
      linkText: 'Gate Passes'
    },
    {
      icon: 'facility',
      title: 'Facility Booking',
      tag: 'AMENITY ACCESS',
      description:
        'Interactive reservation for the clubhouse, community banquet hall, floodlit tennis courts, and swimming pool with live slot availability.',
      linkText: 'Book Amenities'
    },
    {
      icon: 'notice',
      title: 'Notices & Announcements',
      tag: 'COMMUNITY BROADCAST',
      description:
        'Broadcast official committee circulars, AGM schedules, water maintenance windows, and festive celebrations with instant resident alerts.',
      linkText: 'View Notices'
    },
    {
      icon: 'resident',
      title: 'Resident Management',
      tag: 'VERIFIED DIRECTORY',
      description:
        'Unified directory of flat owners, tenants, dedicated parking allocations, RFID tags, emergency contacts, and occupancy records.',
      linkText: 'Member Directory'
    }
  ];

  stats = [
    { value: '99.8%', label: 'On-Time Dues Collection' },
    { value: '24/7', label: 'Instant Gate & Pass Security' },
    { value: '4.9 ★', label: 'Resident Satisfaction Rating' },
    { value: '50+', label: 'Housing Societies Powered' }
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) event.preventDefault();
    this.closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitContactForm(): void {
    if (!this.contactForm.name.trim() || !this.contactForm.email.trim() || !this.contactForm.message.trim()) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    this.contactSubmitted.set(true);
    this.showToast('Thank you! Your message has been sent to our society onboarding team.');

    setTimeout(() => {
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      this.contactSubmitted.set(false);
    }, 4000);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3800);
  }
}
