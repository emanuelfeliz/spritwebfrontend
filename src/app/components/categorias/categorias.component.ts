import { GenericResponse } from './../../models/GenericResponse.model';
import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/categorias/categoria.model';
import { CategoriesService } from '../../services/categories.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {

  public categories: Category[] = [];
  public category: Category;
  public creando: boolean = false;
  public editando: boolean = false;
  public textoBoton: string;
  public loading: boolean = false;
  constructor(private popupProviderService: PopupProviderService, private categoriesService: CategoriesService, private router: Router) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
    if (responseAuth.PossibleError == "") {
      if (responseAuth.Response.categorias == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.category = new Category(0, '', '');
        this.textoBoton = "Crear categoría";
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
      PopupType.ERROR);
    }
  }
  //Metodo para validar el objeto
  validateModel = (category: Category): boolean => {
    return category.description != "" && category.code != "";
  }
  editarCategoria = (category: Category) => {
    this.creando = false;
    this.editando = true;
    this.textoBoton = "Cancelar edición";
    this.category = category;
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      this.category = new Category(0, '', '');
      this.textoBoton = "Cancelar";
    } else if (this.creando) {
      this.creando = false;
      this.category = new Category(0, '', '');
      this.textoBoton = "Crear categoría";
    } else if (this.editando) {
      this.editando = false;
      this.category = new Category(0, '', '');
      this.textoBoton = "Crear categoría";
    }
  }
  onSubmit = () => {
    if (this.creando) {
      this.categoriesService.addCategory(this.category)
        .then(
        result => {
          if (result.Success) {
            this.popupProviderService.SimpleMessage('Éxito',
              'Categoría agregada',
              PopupType.SUCCESS);
            this.getCategorias();
          } else {
            this.popupProviderService.SimpleMessage(
              'Categoría no agregada',
              'Algo salió mal!',
              PopupType.ERROR
            );
          }
          this.creando = false;
          this.textoBoton = "Crear categoría";
        }
        ).catch(error => {
          this.popupProviderService.SimpleMessage(
            'Categoría no agregada',
            error,
            PopupType.ERROR
          );
        });
    } else if (this.editando) {
      this.categoriesService.editCategory(this.category)
        .then(
        result => {
          if (result.Success) {
            this.popupProviderService.SimpleMessage(
              'Éxito',
              'Categoría modificada',
              PopupType.SUCCESS
            );
            this.getCategorias();
          } else {
            this.popupProviderService.SimpleMessage(
              'Categoría no modificada',
              'Algo salió mal!',
              PopupType.ERROR
            );
          }
          this.editando = false;
          this.textoBoton = "Crear categoría";
        }).catch(error => {
          this.popupProviderService.SimpleMessage(
            'Categoría no modificada',
            'Algo salió mal!',
            PopupType.ERROR
          );
        });
    }

  }
  getCategorias = () => {
    this.loading = true;
    this.categoriesService.getCategories()
      .then(
      result => {
        if (result.PossibleError == "") {
          this.categories = result.List;
          this.loading = false;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage("Categorias", error, PopupType.ERROR);
      });
  }
  ngOnInit() {
    this.getCategorias();
  }
  deleteCategoria = (categoryid: number) => {
    this.categoriesService.deleteCategory(categoryid).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Categoría eliminada',
          PopupType.SUCCESS
        );
        this.getCategorias();
      } else {
        this.popupProviderService.SimpleMessage(
          'Categoría no eliminada',
          'Algo salió mal!',
          PopupType.ERROR
        );
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage(
        'Categoría no eliminada',
        'Algo salió mal!',
        PopupType.ERROR
      );
    });
  }
  confirmarBorrarCategoria = (category: Category) => {
    this.popupProviderService.QuestionMessage('Eliminar categoría', `Estás seguro de eliminar la categoría ${category.description}?`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.deleteCategoria(category.id);
      }, () => {
      });
  }
}
