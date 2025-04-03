import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  motDePasse: string = '';
  messageErreur: string = '';

  constructor(private authService: LoginService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.email, this.motDePasse).subscribe(
      (response) => {
        console.log(response);
        if (response.role) {
          localStorage.setItem('role', response.role); 

          switch (response.role) {
            case 'ADMIN':
              this.router.navigate(['/dashboard']);
              break;
            case 'RESPONSABLE_RECEPTION':
              this.router.navigate(['/controle']);
              break;
            case 'CONTROLEUR':
              this.router.navigate(['/controle']);
              break;
            default:
              this.router.navigate(['/login']); 
          }
        }
      },
      (error) => {
        console.error(error);
        this.messageErreur = 'Email ou mot de passe incorrect';
      }
    );
  }
 
}
