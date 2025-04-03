import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bl-list',
  templateUrl: './bl-list.component.html',
  styleUrls: ['./bl-list.component.css']
})
export class BlListComponent implements OnInit {
  blList: any[] = [];
  filteredBL: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getBL();
  }

  getBL(): void {
    this.http.get<any[]>('http://localhost:8080/api/bl').subscribe(
      (data) => {
        this.blList = data;
        this.filteredBL = data; // Initialize filtered list
      },
      (error) => {
        console.error('Erreur lors de la récupération des BL:', error);
      }
    );
  }

  // ✅ Fixed: Now filters by 'fournisseur' (supplier)
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

  // ✅ Fixed: Delete by 'idBL' (not 'numBL')
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