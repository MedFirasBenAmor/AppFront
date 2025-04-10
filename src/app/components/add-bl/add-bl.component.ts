import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { ProduitService } from 'src/app/services/produit.service';
import { BlService } from 'src/app/services/bl.service';

@Component({
  selector: 'app-add-bl',
  templateUrl: './add-bl.component.html',
  styleUrls: ['./add-bl.component.css']
})
export class AddBlComponent implements OnInit {
  blForm!: FormGroup;
  fournisseurs: any[] = [];
  produits: any[] = [];

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService,
    private blService: BlService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialisation du formulaire
    this.blForm = this.fb.group({
      numBL: ['', Validators.required],
      dateReception: ['', Validators.required],
      idFournisseur: [null, Validators.required],
      produits: this.fb.array([])  // Array pour les produits
    });

    // Charger les fournisseurs
    this.fournisseurService.getFournisseurs().subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
    });

    // Charger les produits
    this.produitService.getProduits().subscribe(produits => {
      this.produits = produits;
    });
  }

  // Getter pour l'array des produits
  get produitsFormArray(): FormArray {
    return this.blForm.get('produits') as FormArray;
  }

  // Ajouter un produit
  addProduit(): void {
    const produitFormGroup = this.fb.group({
      idProduit: [null, Validators.required],
      quantité: [0, [Validators.required, Validators.min(1)]],
      reference: ['']  // Ajouter la référence
    });
    this.produitsFormArray.push(produitFormGroup);
  }

  // Mise à jour de la référence lorsqu'un produit est sélectionné
  onProduitChange(index: number): void {
    const produitId = this.produitsFormArray.at(index).get('idProduit')?.value;
    const produit = this.produits.find(p => p.idProduit === produitId);
    if (produit) {
      this.produitsFormArray.at(index).get('reference')?.setValue(produit.reference);
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.blForm.valid) {
      const blRequest = {
        numBL: this.blForm.value.numBL,
        dateReception: this.blForm.value.dateReception 
          ? new Date(this.blForm.value.dateReception).toISOString().split('T')[0] 
          : null,
        idFournisseur: this.blForm.value.idFournisseur,
        produits: this.blForm.value.produits.map((produit: any) => {
          // Remplir la référence avec l'ID du produit sélectionné
          const selectedProduit = this.produits.find(p => p.idProduit === produit.idProduit);
          produit.reference = selectedProduit ? selectedProduit.reference : '';
          return {
            idProduit: produit.idProduit,
            quantité: produit.quantité,
            reference: produit.reference // inclure la référence ici
          };
        })
      };

      // Appel du service pour créer le BL dans le backend
      this.blService.addBl(blRequest).subscribe(
        () => {
          console.log("Données envoyées au backend :", blRequest);

          alert('Bon de livraison créé avec succès');
          this.router.navigate(['/add-bl']);  // Rediriger vers la liste des BL
        },
        (error) => {
          console.error('Erreur lors de la création du bon de livraison', error);
        }
      );
    }
  }
}
