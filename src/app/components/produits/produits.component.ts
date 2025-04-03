import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produit, ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: any[] = [];
  filteredProduits: Produit[] = []; // Liste filtrée
    searchQuery: string = ''; // Variable pour le champ de recherche

  constructor(private produitService: ProduitService, private router: Router) {}

  ngOnInit(): void {
    this.getProduits();
  }

  // Récupère la liste des produits
  getProduits(): void {
    this.produitService.getProduits().subscribe(
      (response) => {
        this.produits = response;
        this.filteredProduits = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    
    );
  }

  // Supprimer un produit par son ID
  supprimerProduit(idProduit: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(idProduit).subscribe(
        () => {
          // Mise à jour de la liste des produits après suppression
          this.produits = this.produits.filter(produit => produit.idProduit !== idProduit);
          this.filteredProduits = this.filteredProduits.filter(p=> p.idProduit !== idProduit);
          console.log('Produit supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du produit:', error);
        }
      );
    }
  }

  // Rediriger vers la page de modification du produit
  editProduit(idProduit: number): void {
    this.router.navigate([`/modifier-produit/${idProduit}`]);
  }

   // Méthode pour filtrer les fournisseurs par certificat
   searchProduits(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProduits = this.produits;
    } else {
      this.filteredProduits = this.produits.filter(p =>
        p.reference.toLowerCase().includes(this.searchQuery.toLowerCase())||
        p.fournisseur.nomFournisseur.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

  }
  gererPlanDeControle(idProduit: number) {
    const selectedProduit = this.filteredProduits.find(prod => prod.idProduit === idProduit);
    if (selectedProduit) {
      this.router.navigate(['/plans-de-controle', idProduit], { state: { produit: selectedProduit } });
    }
  }
}
