import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { catchError, switchMap, throwError } from 'rxjs';

interface TokenResponse {
  token: string;  
}
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private apiUrl = 'http://localhost:8080/auth/refresh-token';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  refreshToken() {
    const refreshToken = this.loginService.getRefreshToken();
    if (!refreshToken) {
      return throwError('No refresh token found');
    }

    return this.http.post<any>(this.apiUrl, { refreshToken }).pipe(
      switchMap((response: any) => {
        // Sauvegarde du nouveau token
        localStorage.setItem('token', response.token);
        return response.token;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Méthode pour exécuter une requête avec un token d'accès mis à jour
  executeRequest(req: HttpRequest<any>, token: string) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return this.http.request(clonedReq);
  }
}
