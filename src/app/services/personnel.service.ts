import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  qualifications: string;
  motDePasse: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = 'http://localhost:8080/api/personnels';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Fonction pour récupérer les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

 
  getPersonnels(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiUrl, { headers: this.getHeaders() });
  }

 
  addPersonnel(personnel: Personnel): Observable<Personnel> {
    return this.http.post<Personnel>(this.apiUrl, personnel, { headers: this.getHeaders() });
  }

  
  updatePersonnel(id: number, personnel: Personnel): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.apiUrl}/${id}`, personnel, { headers: this.getHeaders() });
  }

  
  deletePersonnel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
