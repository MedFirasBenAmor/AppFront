import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDeControleService } from 'src/app/services/plan-de-controle.service';
import { ProduitService } from 'src/app/services/produit.service';
@Component({
  selector: 'app-plans-de-controle',
  templateUrl: './plans-de-controle.component.html',
  styleUrls: ['./plans-de-controle.component.css']
})
export class PlansDeControleComponent {
  idProduit!: number;
  réferenceProduit!: string;
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
    private planService: PlanDeControleService,
    private produitService: ProduitService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.produit = history.state.produit;
      this.idProduit = params['idProduit'];
      this.chargerPlansDeControle();
      this.réferenceProduit = this.produit?.reference || ''; // Assurez-vous que la référence est définie
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
  printPlanDeControle() {
    const printContent = document.getElementById('planControleTable')?.outerHTML;
    const header = document.getElementById('planControleCard')?.outerHTML;
    const newWindow = window.open('', '', 'height=500,width=800');
  
    if (newWindow && printContent && header) {
      // Définir la date de création
      const creationDate = new Date().toLocaleDateString();
      const reference = this.réferenceProduit;  // Remplacer par la variable contenant la référence du produit
  
      newWindow.document.write('<html><head><title>Plan de Contrôle</title>');
      newWindow.document.write('<style>');
      newWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
      newWindow.document.write('.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }');
      newWindow.document.write('.header .left, .header .center, .header .right { display: flex; flex-direction: column; }');
      newWindow.document.write('.header .left { align-items: flex-start; }');
      newWindow.document.write('.header .center { text-align: center; flex-grow: 1; }');
      newWindow.document.write('.header .right { text-align: right; }');
      newWindow.document.write('.footer { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }');
      newWindow.document.write('.footer { display: flex; justify-content: space-between; }');
      newWindow.document.write('table { width: 100%; border-collapse: collapse; }');
      newWindow.document.write('th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }');
      newWindow.document.write('.img-right { float: right; margin-left: 20px; }');
      newWindow.document.write('</style>');
      newWindow.document.write('</head><body>');
  
      // En-tête personnalisé
      newWindow.document.write('<div class="header">');
      newWindow.document.write('<div class="left">');
      newWindow.document.write('<img src="assets/img/logoS.png" alt="Logo de la Société" style="height:50px;">');
      newWindow.document.write('</div>');
      newWindow.document.write('<div class="center">');
      newWindow.document.write('<p>Type: Formulaire de référence</p>');
      newWindow.document.write('<h1>Titre: Plan de Contrôle</h1>');
      newWindow.document.write('</div>');
      newWindow.document.write('<div class="right">');
      newWindow.document.write('<p>Date: ' + creationDate + '</p>');
      newWindow.document.write('<p>Mise à jour:.............</p>');
      newWindow.document.write('<p>Révision:.......</p>');
      newWindow.document.write('<p>Référence: ' + reference + '</p>');
      newWindow.document.write('</div>');
      newWindow.document.write('</div>');
  
      // Contenu de la table
      newWindow.document.write(header);
  
      // Appliquer la classe img-right à l'image du produit pour la placer à droite
      const productImage = newWindow.document.querySelector('img');
      if (productImage) {
        productImage.classList.add('img-right');
      }
  
      newWindow.document.write(printContent);
  
      // Pied de page personnalisé
      newWindow.document.write('<div class="footer">');
      newWindow.document.write('<div class="emetteur">Émetteur</div>');
      newWindow.document.write('<div class="visa">VISA</div>');
      newWindow.document.write('</div>');
  
      newWindow.document.write('</body></html>');
      newWindow.document.close(); // Nécessaire pour Firefox
  
      // Attendre que l'image soit chargée avant d'imprimer
      const image = newWindow.document.querySelector('img');
      if (image) {
        image.onload = () => {
          newWindow.print(); // Lancer l'impression après le chargement de l'image
        };
      } else {
        newWindow.print(); // Si l'image n'existe pas, imprime immédiatement
      }
    }
  }
  
  
  
  

 
  
}

