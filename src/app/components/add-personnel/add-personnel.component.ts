import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonnelService } from 'src/app/services/personnel.service';

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-personnel.component.html',
  styleUrls: ['./add-personnel.component.css']
})
export class AddPersonnelComponent {
  personnelForm: FormGroup;
  successMessage: string = ''; 
  errorMessage: string = ''; 
  showPassword: boolean = false; 

  // Liste des rôles possibles
  roles: string[] = ['Responsable Réception', 'Contrôleur'];

  constructor(private fb: FormBuilder, private personnelService: PersonnelService, private router: Router) {
    this.personnelForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), this.noWhitespaceValidator]],
      prenom: ['', [Validators.required, Validators.minLength(2), this.noWhitespaceValidator]],
      matricule: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      qualifications: ['', [Validators.required, this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required] 
    });
  }

  // Fonction pour valider qu'un champ ne contient pas que des espaces
  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return !isWhitespace ? null : { 'whitespace': true };
  }

  // Fonction pour basculer la visibilité du mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.personnelForm.valid) {
      this.personnelService.addPersonnel(this.personnelForm.value).subscribe(
        response => {
         
          this.successMessage = 'Personnel ajouté avec succès !';
          this.errorMessage = ''; 
          this.personnelForm.reset();  // Réinitialiser le formulaire après ajout
        },
        error => {
         
          this.errorMessage = 'Erreur lors de l’ajout du personnel';
          this.successMessage = ''; 
        }
      );
    } else {
      this.errorMessage = 'Formulaire invalide';
      this.successMessage = ''; 
    }
  }
}
