
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Personnel, PersonnelService } from 'src/app/services/personnel.service';

@Component({
  selector: 'app-personnels',
  templateUrl: './personnels.component.html',
  styleUrls: ['./personnels.component.css']
})
export class PersonnelsComponent implements OnInit {
  personnels: Personnel[] = [];
  selectedPersonnel: Personnel | null = null;
  editPersonnelForm: FormGroup;
    selectedPersonnelId: number | null = null;

  constructor(private personnelService: PersonnelService,private fb: FormBuilder) {
    this.editPersonnelForm = this.fb.group({
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          matricule: ['', Validators.required],
          qualifications: ['', Validators.required],
          motDePasse: ['', Validators.required],
          role: ['', Validators.required],
        });
  }

  ngOnInit(): void {
    this.getPersonnels();
  }

  getPersonnels(): void {
    this.personnelService.getPersonnels().subscribe(data => {
      this.personnels = data;
    });
  }

  

  
  // Méthode pour supprimer un personnel
  deletePersonnel(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce personnel ?')) {
      this.personnelService.deletePersonnel(id).subscribe(() => {
        this.personnels = this.personnels.filter(p => p.id !== id);
      });
    }
  }

  // Ouvrir le modal et remplir le formulaire avec les données du fournisseur
    openEditModal(personnel: Personnel): void {
      this.selectedPersonnelId = personnel.id;
      this.editPersonnelForm.setValue({
        nom: personnel.nom,
        prenom: personnel.prenom,
        email: personnel.email,
        matricule: personnel.matricule,
        qualifications: personnel.qualifications,
        motDePasse: personnel.motDePasse,
      });
    }
  
    // Enregistrer les modifications
    onUpdatePersonnel(): void {
      if (this.selectedPersonnelId && this.editPersonnelForm.valid) {
        this.personnelService.updatePersonnel(this.selectedPersonnelId, this.editPersonnelForm.value)
          .subscribe(updatePersonnel => {
            // Mise à jour de la liste des fournisseurs
            this.personnels = this.personnels.map(p =>
              p.id === this.selectedPersonnelId ? updatePersonnel : p
            );
  
            // Fermer le modal
            document.getElementById('editPersonnelModal')?.classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop')?.remove();
          });
      }
    }
}
