import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScanneService } from 'src/app/services/scanne.service';

@Component({
  selector: 'app-scanne',
  templateUrl: './scanne.component.html',
  styleUrls: ['./scanne.component.css']
})
export class ScanneComponent {
  reference: string = '';
  produit: any = null;
  plansDeControle: any[] = [];
  verificateur: string = '';
  numBL: string = '';
  dateDeControle: string = '';

  constructor(private scanneService: ScanneService, private router: Router ) {
    this.verificateur = this.getUtilisateurConnecte();
    this.dateDeControle = new Date().toISOString().split('T')[0];
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
  const controleData = {
    reference: this.produit.reference,
    fournisseur: this.produit.fournisseur?.nomFournisseur,  // Vérifiez si le backend attend l'ID ou le nom du fournisseur
    verificateur: this.verificateur,
    numBL: this.numBL,
    dateDeControle: this.dateDeControle,
    produit: { idProduit: this.produit.idProduit },  // Assurez-vous que le produit est envoyé avec son ID
    resultatsControle: this.plansDeControle.map(plan => ({
      planDeControle: {
        id: plan.id,  // Assurez-vous que l'ID du plan de contrôle est transmis
        caracteristique: plan.caracteristique,
        donneeTechnique: plan.donneeTechnique,
        frequenceEtTailleDePrelevement: plan.frequenceEtTailleDePrelevement,
        methodeDeControle: plan.methodeDeControle,
        moyenDeControle: plan.moyenDeControle,
        tolerance: plan.tolerance
      },
      visuel: plan.isVisuelValid ? "Conforme" : "Non conforme",  // Si c'est un contrôle visuel
      valeurMesuree: plan.valeurMesuree  // Si c'est un contrôle au pied à coulisse
    }))
  };

  this.scanneService.enregistrerControle(controleData)
    .subscribe(
      (response: string) => {
        console.log('Réponse de l\'API:', response);
        alert('Contrôle enregistré avec succès !');
        // Fermer le modal
        this.closeModal();

        // Rediriger vers la page /historique
        this.router.navigate(['/controle']);
      },
      error => {
        console.error('Erreur lors de l\'enregistrement du contrôle', error);
        alert('Une erreur est survenue lors de l\'enregistrement du contrôle.');
      }
    );
}

}
