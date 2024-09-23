import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./Components/home/home.component').then((e) => e.HomeComponent),
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./Components/about/about.component').then(
        (e) => e.AboutComponent
      ),
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./Components/cart-products/cart-products.component').then(
        (e) => e.CartProductsComponent
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./Components/product-details/product-details.component').then(
        (e) => e.ProductDetailsComponent
      ),
  },

  {path:'promotionItem/:id', loadComponent:()=> import('./Components/promotion-by-id/promotion-by-id.component')
.then((e)=> e.PromotionByIDComponent)},
  {
    path: 'searchProduct',
    loadComponent: () =>
      import('./Components/search-product/search-product.component').then(
        (e) => e.SearchProductComponent
      ),
  },
  {
    path: 'productByCat/:id',
    loadComponent: () =>
      import(
        './Components/products-by-category/products-by-category.component'
      ).then((e) => e.ProductsByCategoryComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./Components/page-not-found/page-not-found.component').then(
        (e) => e.PageNotFoundComponent
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabledBlocking' }),
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
