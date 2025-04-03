import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Fournisseur {
  idFournisseur: number;
  nomFournisseur: string;
  certificat: string;
  email: string;
  adresse: string;
  telephone: string;
}

export interface Produit {
  idProduit: number;
  reference: string | null;
  nom: string;
  description: string;
  prix: number;
  imagePath: string | null;
  ficheTechniquePath: string | null;
  fournisseur: Fournisseur;
  moq: number;
  famille?: { nomFamille: string };
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les headers avec le token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

 
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }
 
 
  addProduit(produit: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, produit, { headers: this.getHeaders() });
  }

  
  deleteProduit(idProduit: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idProduit}`, { headers: this.getHeaders() });
  }

  
  uploadImage(idProduit: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    const headers = this.getHeaders(); 
  
    return this.http.post(`${this.apiUrl}/uploadImage/${idProduit}`, formData, { headers: headers });
  }
  
  uploadFicheTechnique(idProduit: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    const headers = this.getHeaders(); 
  
    return this.http.post(`${this.apiUrl}/uploadFicheTechnique/${idProduit}`, formData, { headers: headers });
  }
  

  
  getFournisseurs(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/fournisseurs', { headers: this.getHeaders() });
  }

 
  getProduitsByFournisseur(id: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/fournisseur/${id}`, { headers: this.getHeaders() });
  }
}
