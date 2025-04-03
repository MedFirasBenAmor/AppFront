import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Famille {
  idFamille: number;
  nomFamille: string;
}

@Injectable({
  providedIn: 'root'
})
export class FamilleService {
  private apiUrl = 'http://localhost:8080/api/familles';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    });
  }

  
  getAllFamilles(): Observable<Famille[]> {
    return this.http.get<Famille[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
