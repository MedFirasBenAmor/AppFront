import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlService } from 'src/app/services/bl.service'; // importe BlService
import { Router } from '@angular/router';

@Component({
  selector: 'app-bl-list',
  templateUrl: './bl-list.component.html',
  styleUrls: ['./bl-list.component.css']
})
export class BlListComponent implements OnInit {
  blList: any[] = [];
  filteredBL: any[] = [];
  searchQuery: string = '';
  lastNumBL: string | null = null; // Pour stocker le numBL de la dernière BL

  constructor(private http: HttpClient, private blService: BlService, private router: Router) {}

  ngOnInit(): void {
    this.getBL();
  }

  getBL(): void {
    this.http.get<any[]>('http://localhost:8080/api/bl').subscribe(
      (data) => {
        this.blList = data;
        this.filteredBL = data; // Initialize filtered list
  
        // Ajouter la gestion des références dans chaque BL
        this.blList.forEach(bl => {
          bl.references = bl.produits.map((produit: any) => produit.reference).join(', ');  // Combine references into a single string
        });
  
        this.getLastNumBL(); // Appeler la méthode pour récupérer le dernier numBL
      },
      (error) => {
        console.error('Erreur lors de la récupération des BL:', error);
      }
    );
  }

  saveLastNumBL(numBL: string): void {
    const lastBL = this.blList[this.blList.length - 1];
    if (lastBL && lastBL.id) {  // Bien utiliser l'ID du dernier BL
      this.http.put(`http://localhost:8080/api/bl/updateLastNumBL/${lastBL.id}`, numBL, {
        responseType: 'text'
      }).subscribe(
        (response) => {
          console.log('lastNumBL mis à jour :', response);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de lastNumBL:', error);
        }
      );
    }
  }

  setBL() {
    this.blService.setLastNumBL(this.lastNumBL);
  }

  getLastNumBL(): void {
    const lastBL = this.blList[this.blList.length - 1];
    if (lastBL) {
      this.lastNumBL = lastBL.numBL;
      console.log('Dernier numBL:', this.lastNumBL);

      // ✅ Sauvegarder correctement dans localStorage
      localStorage.setItem('lastNumBL', this.lastNumBL || '');

      // ✅ Mettre à jour aussi dans BlService si besoin
      this.blService.setLastNumBL(this.lastNumBL);
    }
  }

  goToScanner(): void {
    const lastBL = this.blList[this.blList.length - 1];
    if (lastBL) {
      const lastNumBL = lastBL.numBL;
      this.router.navigate(['/scanner'], { state: { numBL: lastNumBL } });
    }
  }

  searchBL(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBL = this.blList; // Reset if search is empty
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredBL = this.blList.filter(bl =>
        bl.fournisseur?.nomFournisseur?.toLowerCase().includes(query) // Check nested 'nomFournisseur'
      );
    }
  }

  supprimerBL(idBL: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce BL ?')) {
      this.http.delete(`http://localhost:8080/bl/delete/${idBL}`).subscribe(
        () => {
          this.blList = this.blList.filter(bl => bl.idBL !== idBL);
          this.filteredBL = this.filteredBL.filter(bl => bl.idBL !== idBL);
          alert('BL supprimé avec succès !');
        },
        (error) => {
          console.error('Erreur lors de la suppression du BL:', error);
          alert('Erreur lors de la suppression.');
        }
      );
    }
  }

  onUpdateList(updatedBL: any): void {
    this.blList = this.blList.map(bl =>
      bl.idBL === updatedBL.idBL ? updatedBL : bl
    );
    this.filteredBL = this.filteredBL.map(bl =>
      bl.idBL === updatedBL.idBL ? updatedBL : bl
    );

    // Close modal (adjust based on your HTML)
    const modal = document.getElementById('editBLModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
    }
  }
}
