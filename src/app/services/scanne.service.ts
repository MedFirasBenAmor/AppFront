import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanneService {

  private apiUrl = 'http://localhost:8080/api/produits';
  private apiUrl1 = 'http://localhost:8080/api/controles';

  constructor(private http: HttpClient) {}

  getProduitByReference(reference: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reference/${reference}`);
  }
  getPlansDeControleByProduit(idProduit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idProduit}/plansDeControle`);
  }

  enregistrerControle(data: any): Observable<string> {
    const token = localStorage.getItem('token'); // Vérifier que le token est bien récupéré
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    console.log("Données envoyées :", data); // Log des données envoyées
  
    return this.http.post(this.apiUrl1 + '/enregistrer', data, { headers, responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error("Erreur lors de l'enregistrement du contrôle :", error);
          return throwError(error); // Renvoie l'erreur pour gestion en amont
        })
      );
  }
}
