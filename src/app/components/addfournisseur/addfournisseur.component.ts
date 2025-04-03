import { FournisseurService } from './../../services/fournisseur.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addfournisseur',
  templateUrl: './addfournisseur.component.html',
  styleUrls: ['./addfournisseur.component.css']
})
export class AddfournisseurComponent {
  fournisseurForm: FormGroup;
  

  constructor(private fb: FormBuilder, private fournisseurService: FournisseurService) {
    this.fournisseurForm = this.fb.group({
      nomFournisseur: ['', Validators.required],
      certificat: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  onSubmit() {
    if (this.fournisseurForm.valid) {
      this.fournisseurService.addFournisseur(this.fournisseurForm.value).subscribe(
        response => {
          console.log('Fournisseur ajouté avec succès !', response);
          this.fournisseurForm.reset(); 
        },
        error => {
          console.error('Erreur lors de l’ajout du fournisseur', error);
        }
      );
    } else {
      console.log('Formulaire invalide');
    }
  }
}
