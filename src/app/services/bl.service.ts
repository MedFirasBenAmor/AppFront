// bl.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlService {
  private apiUrl = 'http://localhost:8080/api/bl/create';  // URL pour envoyer les données du BL

  constructor(private http: HttpClient) { }
  getBL(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/bl');
  
  }
  deleteBl(idBL: number): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/api/bl/idBL}');
  }

  // Méthode pour envoyer le bon de livraison
  addBl(bl: any): Observable<any> {
    return this.http.post(this.apiUrl, bl);
  }
}
