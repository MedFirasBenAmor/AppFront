import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScanneService } from 'src/app/services/scanne.service';
import { BlService } from 'src/app/services/bl.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-scanne',
  templateUrl: './scanne.component.html',
  styleUrls: ['./scanne.component.css']
})
export class ScanneComponent  {
  reference: string = '';
  produit: any = null;
  plansDeControle: any[] = [];
  verificateur: string = '';
  numBL: string = '';
  dateDeControle: string = '';
    // On expose directement l'observable
    lastNumBL: string | null = null;  // ➡️ Ajouter cette variable
  // ...
  blList: any[] = []; // ➡️ Pour stocker la liste des BL
  quantiteControlee: number | null = null;



  constructor(private scanneService: ScanneService, private router: Router, private blService: BlService ) {
    this.verificateur = this.getUtilisateurConnecte();
    this.dateDeControle = new Date().toISOString().split('T')[0];

  }
  ngOnInit(): void {
;
     // Option 2 : si jamais tu préfères localStorage
     this.lastNumBL = this.blService.getLastNumBL();
     this.numBL = this.lastNumBL || '';   // ➡️ C'est ce qu’il te manque
    
     this.blService.getBL().subscribe((bls) => {
      this.blList = bls;
    });
    // Utilise lastNumBL ici
  }
  getQuantiteByReferenceAndNumBL(reference: string, numBL: string): number {
    for (const bl of this.blList) {
      if (bl.numBL === numBL) {
        const produit = bl.produits.find((p: any) => p.reference === reference);
        if (produit) {
          return produit.quantite; // ➡️ Retourner la quantité
        }
      }
    }
    return 0; // ➡️ Si pas trouvé
  }
  rechercherQuantite() {
    const quantite = this.getQuantiteByReferenceAndNumBL(this.reference, this.numBL);
    console.log('Quantité trouvée :', quantite);
    // Tu peux afficher ou utiliser cette quantité dans ton HTML
  }
  
  

  // Méthode pour ouvrir le modal
  openModal() {
    const modal = document.getElementById("validationModal");
    if (modal) modal.style.display = "flex";
  }
  
  

  // Méthode pour fermer le modal
  closeModal() {
    const modal = document.getElementById("validationModal");
    if (modal) modal.style.display = "none";
  }

  // Simule la récupération du nom de l'utilisateur connecté
  getUtilisateurConnecte(): string {
    return localStorage.getItem('nom') ?? 'Utilisateur inconnu';
  }

  // Méthode pour rechercher un produit par référence
  rechercherProduit() {
    if (!this.reference) return;
    this.scanneService.getProduitByReference(this.reference)
      .subscribe((data: any) => {
        this.produit = data;
        // Récupérer les plans de contrôle du produit
        this.getPlansDeControle(this.produit.idProduit);
      });
  }
  calculerNombreEtiquettes() {
    if (this.produit && this.produit.MOQ && this.numBL) {
      // Supposons que tu récupères la quantité commandée via le numBL
      const quantiteCommande = this.getQuantiteCommandeForNumBL(this.numBL);
      const nombreEtiquettes = Math.ceil(quantiteCommande / this.produit.MOQ);  // Utilisation de Math.ceil pour arrondir à l'entier supérieur
      return nombreEtiquettes;
    }
    return 0;
  }
  getQuantiteCommandeForNumBL(numBL: string): number {
    // Tu peux récupérer cette valeur à partir de l'API ou d'une logique supplémentaire
    // Par exemple, ici, on suppose que tu as la quantité commandée dans un attribut de numBL
    return 100; // Exemple avec une quantité fixe (remplace par ta logique)
  }
  tousLesPlansSontConformes(): boolean {
    return this.plansDeControle.every(plan => plan.isValid === true || plan.isVisuelValid === true);
  }
  

  // Méthode pour récupérer les plans de contrôle d'un produit
  getPlansDeControle(idProduit: number) {
    this.scanneService.getPlansDeControleByProduit(idProduit)
      .subscribe((plans: any) => {
        this.plansDeControle = plans;
        this.plansDeControle.forEach(plan => {
          plan.isValid = null;
        });
      });
  }

  // Méthode pour valider la valeur mesurée par rapport à la tolérance
  validateValue(plan: any) {
    if (plan && plan.donneeTechnique && plan.tolerance && plan.valeurMesuree) {
      const valeurMesuree = parseFloat(plan.valeurMesuree);
      const valeurTechnique = parseFloat(plan.donneeTechnique);
      const toleranceStr = plan.tolerance.replace(/\s/g, '').replace('±', '').replace('+/-', '');
      const tolerance = parseFloat(toleranceStr);

      if (isNaN(valeurMesuree) || isNaN(valeurTechnique) || isNaN(tolerance)) {
        plan.isValid = null;
      } else {
        const valeurMin = valeurTechnique - tolerance;
        const valeurMax = valeurTechnique + tolerance;

        plan.isValid = valeurMesuree >= valeurMin && valeurMesuree <= valeurMax;
      }
    } else {
      plan.isValid = null;
    }
  }

  // Méthode pour valider le contrôle visuel
  validateVisuel(plan: any) {
    if (plan.visuel === 'Non Conforme') {
      plan.isVisuelValid = false;
    } else {
      plan.isVisuelValid = true;
    }
  }

  // Méthode pour enregistrer le contrôle
  // Méthode pour enregistrer le contrôle
  enregistrerControle() {
    if (!this.tousLesPlansSontConformes()) {
      this.imprimerFicheDeRefus()
      return;
    }
  
    const controleData = {
      reference: this.produit.reference,
      fournisseur: this.produit.fournisseur?.nomFournisseur,
      verificateur: this.verificateur,
      numBL: this.numBL,
      dateDeControle: this.dateDeControle,
      produit: { idProduit: this.produit.idProduit },
      resultatsControle: this.plansDeControle.map(plan => ({
        planDeControle: {
          id: plan.id,
          caracteristique: plan.caracteristique,
          donneeTechnique: plan.donneeTechnique,
          frequenceEtTailleDePrelevement: plan.frequenceEtTailleDePrelevement,
          methodeDeControle: plan.methodeDeControle,
          moyenDeControle: plan.moyenDeControle,
          tolerance: plan.tolerance
        },
        visuel: plan.isVisuelValid ? "Conforme" : "Non conforme",
        valeurMesuree: plan.valeurMesuree
      }))
    };
  
    this.scanneService.enregistrerControle(controleData).subscribe(
      (response: string) => {
        console.log('Réponse de l\'API:', response);
        alert('Contrôle enregistré avec succès !');
  
        // Fermer le modal
        this.closeModal();
  
        // 🔥 Déclencher l'impression
        this.imprimerEtiquette();
  
        // Rediriger vers la page /controle
       // this.router.navigate(['/controle']);
      },
      error => {
        console.error('Erreur lors de l\'enregistrement du contrôle', error);
        alert('Une erreur est survenue lors de l\'enregistrement du contrôle.');
      }
    );
  }
  // Méthode pour imprimer la fiche de refus
imprimerFicheDeRefus() {
  const raisonRefus = prompt('On va imprimer une fiche de refus, veuillez donner la raison dans le champ ci-dessous :');
  
  if (raisonRefus) {
    const printContent = `
      <html>
      <head>
        <title>Fiche de Refus</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .fiche-refus {
            border: 2px solid black;
            padding: 10px;
            margin: 20px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="fiche-refus">
          <h2>Fiche de Refus</h2>
          <p><strong>Référence:</strong> ${this.produit.reference}</p>
          <p><strong>Fournisseur:</strong> ${this.produit.fournisseur?.nomFournisseur}</p>
          <p><strong>Vérificateur:</strong> ${this.verificateur}</p>
          <p><strong>Numéro BL:</strong> ${this.numBL}</p>
          <p><strong>Date de Contrôle:</strong> ${this.dateDeControle}</p>
          <p><strong>Raison du Refus:</strong> ${raisonRefus}</p>
          <p><strong>Résultat:</strong> ❌ Non conforme</p>
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  } else {
    alert("Vous devez entrer une raison pour le refus.");
  }
}

  
  
  imprimerEtiquette() {
    const printContent = `
      <html>
      <head>
        <title>Étiquette de Contrôle</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .etiquette {
            border: 2px solid black;
            padding: 10px;
            margin: 20px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="etiquette">
          <h2>Étiquette de Contrôle</h2>
          <p><strong>Référence:</strong> ${this.produit.reference}</p>
          <p><strong>Fournisseur:</strong> ${this.produit.fournisseur?.nomFournisseur}</p>
          <p><strong>Vérificateur:</strong> ${this.verificateur}</p>
          <p><strong>Numéro BL:</strong> ${this.numBL}</p>
          <p><strong>Date de Contrôle:</strong> ${this.dateDeControle}</p>
          <p><strong>Résultat:</strong> ✅ Conforme</p>
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  }
  
  
  

}
