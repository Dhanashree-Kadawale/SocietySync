import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const userJson = localStorage.getItem('societysync_user') || sessionStorage.getItem('societysync_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.token) {
          headers = headers.set('Authorization', `Bearer ${user.token}`);
        }
      } catch (e) {
        // ignore
      }
    }
    return headers;
  }

  // ── Authentication ──
  login(body: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/login`, body, { headers: this.getHeaders() });
  }

  register(body: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/register`, body, { headers: this.getHeaders() });
  }

  getMe(identity: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('identity', identity);
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/auth/me`, { headers: this.getHeaders(), params });
  }

  // ── Dashboard ──
  getDashboardStats(societyId?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/stats`, { headers: this.getHeaders(), params });
  }

  // ── Societies ──
  getSocieties(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/societies`, { headers: this.getHeaders() });
  }

  createSociety(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/societies`, data, { headers: this.getHeaders() });
  }

  updateSociety(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/societies/${id}`, data, { headers: this.getHeaders() });
  }

  deleteSociety(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/societies/${id}`, { headers: this.getHeaders() });
  }

  // ── Verifications ──
  getVerifications(status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/verifications`, { headers: this.getHeaders(), params });
  }

  submitVerification(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/verifications`, data, { headers: this.getHeaders() });
  }

  updateVerificationStatus(id: number, status: string, notes?: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/verifications/${id}/status`, { status, notes }, { headers: this.getHeaders() });
  }

  // ── Buildings & Flats ──
  getBuildings(societyId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/buildings`, { headers: this.getHeaders(), params });
  }

  createBuilding(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/buildings`, data, { headers: this.getHeaders() });
  }

  deleteBuilding(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/buildings/${id}`, { headers: this.getHeaders() });
  }

  getFlats(societyId?: number, buildingId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (buildingId) params = params.set('buildingId', buildingId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/flats`, { headers: this.getHeaders(), params });
  }

  createFlat(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/flats`, data, { headers: this.getHeaders() });
  }

  updateFlat(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/flats/${id}`, data, { headers: this.getHeaders() });
  }

  deleteFlat(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/flats/${id}`, { headers: this.getHeaders() });
  }

  // ── Residents ──
  getResidents(societyId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/residents`, { headers: this.getHeaders(), params });
  }

  createResident(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/residents`, data, { headers: this.getHeaders() });
  }

  updateResident(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/residents/${id}`, data, { headers: this.getHeaders() });
  }

  deleteResident(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/residents/${id}`, { headers: this.getHeaders() });
  }

  // ── Staff ──
  getStaff(societyId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/staff`, { headers: this.getHeaders(), params });
  }

  createStaff(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/staff`, data, { headers: this.getHeaders() });
  }

  updateStaff(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/staff/${id}`, data, { headers: this.getHeaders() });
  }

  deleteStaff(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/staff/${id}`, { headers: this.getHeaders() });
  }

  // ── Complaints ──
  getComplaints(societyId?: number, residentId?: number, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (residentId) params = params.set('residentId', residentId);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/complaints`, { headers: this.getHeaders(), params });
  }

  createComplaint(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/complaints`, data, { headers: this.getHeaders() });
  }

  updateComplaint(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/complaints/${id}`, data, { headers: this.getHeaders() });
  }

  deleteComplaint(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/complaints/${id}`, { headers: this.getHeaders() });
  }

  // ── Billing & Payments ──
  getBills(societyId?: number, residentId?: number, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (residentId) params = params.set('residentId', residentId);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/bills`, { headers: this.getHeaders(), params });
  }

  createBill(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/bills`, data, { headers: this.getHeaders() });
  }

  updateBill(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/bills/${id}`, data, { headers: this.getHeaders() });
  }

  payBill(id: number, paymentMethod: string = 'UPI', transactionId?: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/bills/${id}/pay`, { paymentMethod, transactionId }, { headers: this.getHeaders() });
  }

  recordPayment(data: any): Observable<ApiResponse<any>> {
    const billId = Number(data.billId);
    if (!Number.isInteger(billId) || billId < 1) {
      throw new Error('A valid bill ID is required to record a payment.');
    }
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/bills/${billId}/pay`, {
      paymentMethod: data.paymentMethod || 'UPI',
      transactionId: data.transactionId
    }, { headers: this.getHeaders() });
  }

  getPayments(societyId?: number, residentId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (residentId) params = params.set('residentId', residentId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/payments`, { headers: this.getHeaders(), params });
  }

  // ── Facilities & Bookings ──
  getFacilities(societyId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/facilities`, { headers: this.getHeaders(), params });
  }

  createFacility(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/facilities`, data, { headers: this.getHeaders() });
  }

  updateFacility(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/facilities/${id}`, data, { headers: this.getHeaders() });
  }

  deleteFacility(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/facilities/${id}`, { headers: this.getHeaders() });
  }

  getBookings(societyId?: number, residentId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (residentId) params = params.set('residentId', residentId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/bookings`, { headers: this.getHeaders(), params });
  }

  bookFacility(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/bookings`, data, { headers: this.getHeaders() });
  }

  createBooking(data: any): Observable<ApiResponse<any>> {
    return this.bookFacility(data);
  }

  updateBookingStatus(id: number, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/bookings/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  // ── Visitors ──
  getVisitors(societyId?: number, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/visitors`, { headers: this.getHeaders(), params });
  }

  createVisitor(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/visitors`, data, { headers: this.getHeaders() });
  }

  checkoutVisitor(id: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/visitors/${id}/checkout`, {}, { headers: this.getHeaders() });
  }

  updateVisitorStatus(id: number, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/visitors/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  deleteVisitor(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/visitors/${id}`, { headers: this.getHeaders() });
  }

  // ── Notices ──
  getNotices(societyId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/notices`, { headers: this.getHeaders(), params });
  }

  createNotice(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/notices`, data, { headers: this.getHeaders() });
  }

  updateNotice(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/notices/${id}`, data, { headers: this.getHeaders() });
  }

  deleteNotice(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/notices/${id}`, { headers: this.getHeaders() });
  }

  // ── Documents ──
  getDocuments(societyId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/documents`, { headers: this.getHeaders(), params });
  }

  createDocument(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/documents`, data, { headers: this.getHeaders() });
  }

  deleteDocument(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/documents/${id}`, { headers: this.getHeaders() });
  }

  // ── Expenses ──
  getExpenses(societyId?: number, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/expenses`, { headers: this.getHeaders(), params });
  }

  createExpense(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/expenses`, data, { headers: this.getHeaders() });
  }

  updateExpenseStatus(id: number, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/expenses/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  deleteExpense(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/expenses/${id}`, { headers: this.getHeaders() });
  }

  // ── Polls ──
  getPolls(societyId?: number, userId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (userId) params = params.set('userId', userId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/polls`, { headers: this.getHeaders(), params });
  }

  createPoll(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/polls`, data, { headers: this.getHeaders() });
  }

  updatePoll(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/polls/${id}`, data, { headers: this.getHeaders() });
  }

  deletePoll(id: number, societyId: number): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('societyId', societyId);
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/polls/${id}`, { headers: this.getHeaders(), params });
  }

  votePoll(pollId: number, optionId: number, userId?: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/polls/${pollId}/vote`, { optionId, userId }, { headers: this.getHeaders() });
  }

  // ── Notifications ──
  getNotifications(userId?: number): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/notifications`, { headers: this.getHeaders(), params });
  }

  markNotificationRead(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/notifications/${id}/read`, {}, { headers: this.getHeaders() });
  }

  markAllNotificationsRead(userId: number): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/notifications/read-all`, {}, { headers: this.getHeaders(), params });
  }

  // ── Support Tickets ──
  getSupportTickets(societyId?: number, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (societyId) params = params.set('societyId', societyId);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/support-tickets`, { headers: this.getHeaders(), params });
  }

  createSupportTicket(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/support-tickets`, data, { headers: this.getHeaders() });
  }

  addSupportTicketMessage(ticketId: number, data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/support-tickets/${ticketId}/messages`, data, { headers: this.getHeaders() });
  }

  updateSupportTicketStatus(ticketId: number, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/support-tickets/${ticketId}/status`, { status }, { headers: this.getHeaders() });
  }
}
