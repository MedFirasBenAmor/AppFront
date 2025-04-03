import { FournisseurService } from '../../services/fournisseur.service';
import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../../services/fournisseur.service';
import { Produit, ProduitService } from 'src/app/services/produit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  editFournisseurForm: FormGroup;
  selectedFournisseurId: number | null = null;
  filteredFournisseurs: Fournisseur[] = []; // Liste filtrée
  searchQuery: string = ''; // Variable pour le champ de recherche

  constructor(private FournisseurService: FournisseurService, private ProduitService: ProduitService, private fb: FormBuilder) {
    this.editFournisseurForm = this.fb.group({
      nomFournisseur: ['', Validators.required],
      certificat: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.getFournisseurs();
  }

  getFournisseurs(): void {
    this.FournisseurService.getFournisseurs().subscribe(data => {
      this.fournisseurs = data;
      this.filteredFournisseurs = data;
    });
  }

  deleteFournisseur(id: number): void {
    if (confirm('Voulez-vous supprimer ce fournisseur ?')) {
      this.FournisseurService.deleteFournisseur(id).subscribe(() => {
        this.fournisseurs = this.fournisseurs.filter(f => f.idFournisseur !== id);
        this.filteredFournisseurs = this.filteredFournisseurs.filter(f => f.idFournisseur !== id);
      });
    }
  }

  // Ouvrir le modal et remplir le formulaire avec les données du fournisseur
  openEditModal(fournisseur: Fournisseur): void {
    this.selectedFournisseurId = fournisseur.idFournisseur;
    this.editFournisseurForm.setValue({
      nomFournisseur: fournisseur.nomFournisseur,
      certificat: fournisseur.certificat,
      email: fournisseur.email,
      adresse: fournisseur.adresse,
      telephone: fournisseur.telephone
    });
  }

  // Enregistrer les modifications
  onUpdateFournisseur(): void {
    if (this.selectedFournisseurId && this.editFournisseurForm.valid) {
      this.FournisseurService.updateFournisseur(this.selectedFournisseurId, this.editFournisseurForm.value)
        .subscribe(updatedFournisseur => {
          // Mise à jour de la liste des fournisseurs
          this.fournisseurs = this.fournisseurs.map(f =>
            f.idFournisseur === this.selectedFournisseurId ? updatedFournisseur : f
          );

          this.filteredFournisseurs = this.filteredFournisseurs.map(f =>
            f.idFournisseur === this.selectedFournisseurId ? updatedFournisseur : f
          );

          // Fermer le modal
          document.getElementById('editFournisseurModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.querySelector('.modal-backdrop')?.remove();
        });
    }
  }

  // Méthode pour filtrer les fournisseurs par certificat
  searchFournisseurs(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredFournisseurs = this.fournisseurs;
    } else {
      this.filteredFournisseurs = this.fournisseurs.filter(f =>
        f.certificat.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

  }

  // Ajoutez la méthode printFournisseurs()
  printFournisseurs() {
    const printContent = document.getElementById('fournisseursTable')?.outerHTML;
    const newWindow = window.open('', '', 'height=500,width=800');
    if (newWindow && printContent) {
      // Définir la date de création (ici la date du jour)
      const creationDate = new Date().toLocaleDateString();
  
      newWindow.document.write('<html><head><title>Panel des Fournisseurs</title>');
      newWindow.document.write('<style>');
      newWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
      newWindow.document.write('.header, .footer { display: flex; justify-content: space-between; align-items: center; }');
      newWindow.document.write('.header { margin-bottom: 20px; }');
      newWindow.document.write('.footer { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }');
      newWindow.document.write('table { width: 100%; border-collapse: collapse; }');
      newWindow.document.write('th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }');
      newWindow.document.write('</style>');
      newWindow.document.write('</head><body>');
  
      // En-tête personnalisé
      newWindow.document.write('<div class="header">');
      newWindow.document.write('<div class="logo"><img src="assets/img/logo2.png" alt="Logo de la Société" style="height:50px;"></div>');
     

      newWindow.document.write('<div class="title"><h1>Panel De Fournisseurs</h1></div>');
      newWindow.document.write('<div class="date"><span>' + creationDate + '</span></div>');
      newWindow.document.write('</div>');
  
      // Contenu de la table
      newWindow.document.write(printContent);
  
      // Pied de page personnalisé
      newWindow.document.write('<div class="footer">');
      newWindow.document.write('<div class="emetteur">Emetteur</div>');
      newWindow.document.write('<div class="visa">VISA</div>');
      newWindow.document.write('</div>');
  
      newWindow.document.write('</body></html>');
      newWindow.document.close(); // Nécessaire pour Firefox
      newWindow.print(); // Lancer l'impression
    }
  }



}
