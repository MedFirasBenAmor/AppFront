import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // ✅
import { tap } from 'rxjs/operators'; // ✅ pour mettre à jour la liste automatiquement

@Injectable({
  providedIn: 'root'
})
export class BlService {
  private apiUrl = 'http://localhost:8080/api/bl/create';  
  private lastNumBL: string = '';

  // ✅ Ajouter un BehaviorSubject pour stocker la liste des BL
  private blListSubject = new BehaviorSubject<any[]>([]);
  blList$ = this.blListSubject.asObservable(); // Flux observable si tu veux t'abonner

  constructor(private http: HttpClient) {}

  getBL(): Observable<any[]> {
    // Quand on récupère la liste depuis le serveur, on met aussi à jour blListSubject
    return this.http.get<any[]>('http://localhost:8080/api/bl').pipe(
      tap((blList) => this.blListSubject.next(blList)) // ✅ mettre à jour localement
    );
  }

  // ✅ Nouvelle méthode : récupérer la liste des BL en mémoire
  getLocalBlList(): any[] {
    return this.blListSubject.value;
  }

  deleteBl(idBL: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/bl/${idBL}`); // 🛠️ Correction ici : il manquait {
  }

  addBl(bl: any): Observable<any> {
    return this.http.post(this.apiUrl, bl);
  }

  setLastNumBL(bl: string | null) {
    this.lastNumBL = bl ?? '';
  }

  getLastNumBL(): string | null {
    return localStorage.getItem('lastNumBL') ?? null;
  }
}
