import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-view-produits-fournisseur',
  templateUrl: './view-produits-fournisseur.component.html',
  styleUrls: ['./view-produits-fournisseur.component.css']
})
export class ViewProduitsFournisseurComponent implements OnInit{
  produits: any[] = [];
  fournisseurId!: number;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService, private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du fournisseur depuis la route
    this.fournisseurId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Appeler le service pour récupérer les produits
    this.produitService.getProduitsByFournisseur(this.fournisseurId).subscribe(
      (data) => {
        this.produits = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['/fournisseurs']);  // Naviguer vers la page précédente
  }
}
