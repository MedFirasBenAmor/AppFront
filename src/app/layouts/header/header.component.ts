import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role!: string| null;
  nom!: string | null;
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.role = this.loginService.getRole(); 
    this.nom = this.loginService.getNom();
  }

  logout() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }

}
