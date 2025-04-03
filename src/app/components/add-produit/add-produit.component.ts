import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProduitService } from 'src/app/services/produit.service';
import { FournisseurService } from 'src/app/services/fournisseur.service'; // Service pour récupérer les fournisseurs
import { HttpClient } from '@angular/common/http';
import { FamilleService } from 'src/app/services/famille.service';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.css']
})
export class AddProduitComponent implements OnInit {
  produitForm!: FormGroup;
  fournisseurs: any[] = [];
  imagePath: string | ArrayBuffer | null = null;
  ficheTechniquePath: string | ArrayBuffer | null = null;
  familles: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private familleService : FamilleService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire
    this.produitForm = this.fb.group({
      reference: ['', Validators.required],
      nom: ['', Validators.required],
      imagePath: [''],
      ficheTechniquePath: [''],
      fournisseur: [null, Validators.required],
      famille: [null, Validators.required],
      moq: ['', Validators.required],
      

    });

    // Récupérer la liste des fournisseurs
    this.fournisseurService.getFournisseurs().subscribe((fournisseurs) => {
      this.fournisseurs = fournisseurs;
    });
    // Récupérer toutes les familles
    this.familleService.getAllFamilles().subscribe(familles => {
      this.familles = familles;
    });
  }
/** 
  ajouterCaracteristique() {
    this.router.navigate(['/ajoutercaracteristique']);  // Remplacez par la route de votre page de caractéristiques
  }

  // Getter pour l'array des caractéristiques
  get caracteristiques(): FormArray {
    return this.produitForm.get('caracteristiques') as FormArray;
  }

  // Ajouter une caractéristique
  addCaracteristique(): void {
    const caracteristique = this.fb.group({
      nom: ['', Validators.required],
      valeur: ['', Validators.required],
      tolerance: ['', Validators.required] // Ajout du champ tolérance
    });
    this.caracteristiques.push(caracteristique);
  }

  
  // Supprimer une caractéristique
removeCaracteristique(index: number): void {
  this.caracteristiques.removeAt(index);
}

*/
  // Gérer le changement de l'image
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.http.post('http://localhost:8080/api/produits/uploadImage', formData, { responseType: 'text' }).subscribe(
        (responseText) => {
          try {
            const response = JSON.parse(responseText); // ✅ Convertir manuellement en JSON
            console.log('Réponse backend parsée:', response);
            this.produitForm.patchValue({ imagePath: response.imagePath });
            this.imagePath = 'http://localhost:8080' + response.imagePath;
          } catch (e) {
            console.error("Erreur lors du parsing de la réponse", e);
          }
        },
        (error) => {
          console.error('Erreur lors de l\'upload de l\'image', error);
        }
      );
    }
  }
  // upload ficheTechnique
  onFicheTechniqueUpload(event: any) {
    const file = event.target.files[0];
  
    // Vérifier si un produit est sélectionné
    
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.http.post(`http://localhost:8080/api/produits/uploadFicheTechnique`, formData, { responseType: 'text' })
        .subscribe(
          (responseText) => {
            try {
              const response = JSON.parse(responseText);
              console.log('Réponse backend parsée:', response);
              this.produitForm.patchValue({ ficheTechniquePath: response.ficheTechniquePath });
              this.ficheTechniquePath = 'http://localhost:8080' + response.ficheTechniquePath;
            } catch (e) {
              console.error("Erreur lors du parsing de la réponse", e);
            }
          },
          (error) => {
            console.error('Erreur lors de l\'upload de la fiche technique', error);
          }
        );
    }
  }
  

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.produitForm.valid) {
      const produit = {
        reference: this.produitForm.value.reference,
        nom: this.produitForm.value.nom,
        //description: this.produitForm.value.description,
        //prix: this.produitForm.value.prix,
        imagePath: this.produitForm.value.imagePath, // Vous pouvez envoyer un chemin d'image ou l'image elle-même
        fournisseur: {
          idFournisseur: this.produitForm.value.fournisseur
        },
        ficheTechniquePath: this.produitForm.value.ficheTechniquePath,
        
       
        famille: {
          idFamille: this.produitForm.value.famille // Correction ici
        },
        moq: this.produitForm.value.moq,
      };
      

      // Envoyer le produit au backend
      this.produitService.addProduit(produit).subscribe(
        () => {
          alert('Produit ajouté avec succès!');
          this.router.navigate(['/produits']); // Rediriger vers la liste des produits
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit:', error);
          
        }
      );
    }
  }
}
