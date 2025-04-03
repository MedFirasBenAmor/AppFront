import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService, private tokenService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.loginService.getToken();  // Récupérer le token actuel

        // Si le token existe, l'ajouter à l'en-tête de la requête
        let request = req;
        if (token) {
            request = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        // Gérer la requête et les erreurs
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Si le serveur renvoie une erreur 401 (non autorisé), rafraîchir le token
                if (error.status === 401) {
                    // Rafraîchir le token
                    return this.tokenService.refreshToken().pipe(
                        switchMap((newToken: any) => {
                            // Cloner la requête avec le nouveau token
                            request = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newToken}`
                                }
                            });

                            // Réexécuter la requête initiale avec le nouveau token
                            return next.handle(request);
                        }),
                        catchError(refreshError => {
                            // Si le rafraîchissement échoue, retourner à la page de login
                            console.error('Erreur lors du rafraîchissement du token:', refreshError);
                            this.loginService.logout();  // Par exemple, déconnecter l'utilisateur
                            return throwError(refreshError);
                        })
                    );
                }
                return throwError(error); // Si une autre erreur, la propager
            })
        );
    }
    }