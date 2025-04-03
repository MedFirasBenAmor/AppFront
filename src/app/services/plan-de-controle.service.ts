import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export class PlanDeControle {
  id?: number;
  caracteristique!: string;
  donneeTechnique!: string;
  tolerance!: string;
  frequenceEtTailleDePrelevement!: string;
  moyenDeControle!: string;
  methodeDeControle!: string;
  //produit!: Produit; // Référence au produit associé
}
@Injectable({
  providedIn: 'root'
})
export class PlanDeControleService {
  private apiUrl = 'http://localhost:8080/api/plans-de-controle';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  
  getPlansByProduit(idProduit: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produit/${idProduit}`, { headers: this.getHeaders() });
  }

  
  ajouterPlan(plan: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajouter`, plan, { headers: this.getHeaders() });
  }

  modifierPlan(plan: any): Observable<any> {
    // Assurez-vous que l'URL d'API est correcte et contient l'ID du plan si nécessaire
    const url = `${this.apiUrl}/modifier/${plan.id}`; // Ajout de l'ID du plan dans l'URL si nécessaire
  
    return this.http.put<any>(url, plan, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la modification du plan:', error);
        return throwError(error); // Rejette l'erreur pour un traitement ultérieur
      })
    );
  }
  
  supprimerPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimer/${id}`, { headers: this.getHeaders() });
  }
}
