import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDeControleService } from 'src/app/services/plan-de-controle.service';

@Component({
  selector: 'app-plans-de-controle',
  templateUrl: './plans-de-controle.component.html',
  styleUrls: ['./plans-de-controle.component.css']
})
export class PlansDeControleComponent {
  idProduit!: number;
  plans: any[] = [];
  planDeControleLignes: any[] = [
    { caracteristique: '', donneeTechnique: '', tolerance: '', frequenceEtTailleDePrelevement: '', moyenDeControle: '', methodeDeControle: '' }
  ];
  selectedPlan: any = {};  // Plan sélectionné pour modification
  isModalOpen: boolean = false;
  isModalModifyOpen: boolean = false; // Contrôle du modal de modification
  produit: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanDeControleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.produit = history.state.produit;
      this.idProduit = params['idProduit'];
      this.chargerPlansDeControle();
    });
  }

  chargerPlansDeControle() {
    this.planService.getPlansByProduit(this.idProduit).subscribe(data => {
      this.plans = data;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetLignes();
  }

  openModifyModal(plan: any) {
    this.selectedPlan = { ...plan };  // Clone the selected plan to edit
    this.isModalModifyOpen = true;
  }

  closeModifyModal() {
    this.isModalModifyOpen = false;
    this.selectedPlan = {};  // Reset the selected plan
  }

  ajouterLigne() {
    this.planDeControleLignes.push({
      caracteristique: '', donneeTechnique: '', tolerance: '', frequenceEtTailleDePrelevement: '',
      moyenDeControle: '', methodeDeControle: ''
    });
  }

  supprimerLigne(index: number) {
    this.planDeControleLignes.splice(index, 1);
  }

  resetLignes() {
    this.planDeControleLignes = [
      { caracteristique: '', donneeTechnique: '', tolerance: '', frequenceEtTailleDePrelevement: '', moyenDeControle: '', methodeDeControle: '' }
    ];
  }

  enregistrerPlan() {
    const plan = {
      idProduit: this.idProduit,
      lignes: this.planDeControleLignes
    };

    this.planService.ajouterPlan(plan).subscribe(
      () => {
        this.closeModal();
        this.chargerPlansDeControle();
      },
      error => {
        console.error('Erreur lors de l\'ajout du plan:', error);
      }
    );
  }

  modifierPlan() {
    this.planService.modifierPlan(this.selectedPlan).subscribe(
      () => {
        this.closeModifyModal();
        this.chargerPlansDeControle();
      },
      error => {
        console.error('Erreur lors de la modification du plan:', error);
      }
    );
  }

  supprimerPlan(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) {
      this.planService.supprimerPlan(id).subscribe(
        () => {
          this.chargerPlansDeControle();
        },
        error => {
          console.error('Erreur lors de la suppression du plan:', error);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/produits']);
  }

 
  
}

