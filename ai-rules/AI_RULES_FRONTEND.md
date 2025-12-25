# QuickApp Frontend AI Development Rules

**Reference this file in your AI prompts when extending the QuickApp Angular frontend.**

## Table of Contents
1. [Project Structure](#project-structure)
2. [Components](#components)
3. [Services](#services)
4. [Models](#models)
5. [Routing](#routing)
6. [Authorization Guards](#authorization-guards)
7. [Error Handling](#error-handling)
8. [Naming Conventions](#naming-conventions)

---

## Project Structure

### Folder Organization
```
quickapp.client/src/app/
  ├── components/       # Feature components
  │   ├── controls/     # Reusable UI components
  │   ├── customers/    # Feature-specific components
  │   └── products/     # Feature-specific components
  ├── services/         # Angular services
  ├── models/           # TypeScript interfaces/models
  ├── directives/       # Custom directives
  ├── pipes/            # Custom pipes
  └── app.routes.ts     # Route configuration
```

### Key Principles
- **Standalone Components**: All components use Angular standalone architecture
- **Lazy Loading**: Feature components are lazy-loaded via routes
- **Service Layer**: All API calls go through services extending `EndpointBase`
- **Dependency Injection**: Use `inject()` function (Angular 21 pattern)

---

## Components

### Component Structure
```typescript
// quickapp.client/src/app/components/products/products.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { fadeInOut } from '../../services/animations';
import { AlertService } from '../../services/alert.service';
import { ProductEndpoint } from '../../services/product-endpoint.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  animations: [fadeInOut],
  imports: [TranslateModule]
})
export class ProductsComponent implements OnInit {
  private alertService = inject(AlertService);
  private productEndpoint = inject(ProductEndpoint);

  products: Product[] = [];
  loadingIndicator = true;
  rowsCache: Product[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.productEndpoint.getProductsEndpoint<Product[]>()
      .subscribe({
        next: products => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          this.rowsCache = [...products];
          this.products = products;
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          this.alertService.showStickyMessage(
            'Load Error',
            `Unable to retrieve products from the server.\r\nError: "${this.getHttpResponseMessage(error)}"`,
            MessageSeverity.error,
            error
          );
        }
      });
  }

  private getHttpResponseMessage(error: any): string {
    // Use Utilities.getHttpResponseMessage if available
    return error?.error?.message || error?.message || 'Unknown error';
  }
}
```

### Component Rules
1. ✅ **Use standalone components** - no NgModules
2. ✅ **Use `inject()` function** for dependency injection
3. ✅ **Implement `OnInit`** for initialization logic
4. ✅ **Use `fadeInOut` animation** from `services/animations`
5. ✅ **Import `TranslateModule`** for i18n support
6. ✅ **Use `AlertService`** for loading states and error messages
7. ✅ **Use `loadingIndicator`** boolean for UI loading states
8. ✅ **Cache data in `rowsCache`** for filtering/searching
9. ✅ **Handle errors** in subscribe error callback
10. ❌ **DO NOT use constructor injection** - use `inject()` function
11. ❌ **DO NOT make HTTP calls directly** - use endpoint services
12. ❌ **DO NOT forget to unsubscribe** if using manual subscriptions (use `takeUntil` or async pipe)

### Component Template Pattern
```html
<!-- products.component.html -->
<div class="content">
  <div class="card">
    <div class="card-header">
      <h4>{{ 'Products' | translate }}</h4>
    </div>
    <div class="card-body">
      <div *ngIf="loadingIndicator" class="text-center">
        <i class="fa fa-spinner fa-spin fa-2x"></i>
      </div>
      
      <ngx-datatable
        *ngIf="!loadingIndicator"
        [rows]="products"
        [columns]="columns"
        [loadingIndicator]="loadingIndicator">
      </ngx-datatable>
    </div>
  </div>
</div>
```

---

## Services

### Endpoint Service Pattern
**ALL API services MUST extend `EndpointBase`** which provides:
- Automatic token refresh on 401 errors
- Request headers with Bearer token
- Error handling with retry logic

### Pattern
```typescript
// quickapp.client/src/app/services/product-endpoint.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EndpointBase } from './endpoint-base.service';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ProductEndpoint extends EndpointBase {
  private http = inject(HttpClient);
  private configurations = inject(ConfigurationService);

  get productsUrl() { 
    return this.configurations.baseUrl + '/api/product'; 
  }

  getProductsEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.productsUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getProductsEndpoint<T>());
      })
    );
  }

  getProductEndpoint<T>(productId: number): Observable<T> {
    const endpointUrl = `${this.productsUrl}/${productId}`;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getProductEndpoint<T>(productId));
      })
    );
  }

  getNewProductEndpoint<T>(product: object): Observable<T> {
    return this.http.post<T>(this.productsUrl, JSON.stringify(product), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getNewProductEndpoint<T>(product));
      })
    );
  }

  getUpdateProductEndpoint<T>(product: object, productId: number): Observable<T> {
    const endpointUrl = `${this.productsUrl}/${productId}`;
    return this.http.put<T>(endpointUrl, JSON.stringify(product), this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateProductEndpoint<T>(product, productId));
      })
    );
  }

  getDeleteProductEndpoint<T>(productId: number): Observable<T> {
    const endpointUrl = `${this.productsUrl}/${productId}`;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteProductEndpoint<T>(productId));
      })
    );
  }
}
```

### Service Rules
1. ✅ **MUST extend `EndpointBase`**
2. ✅ **Use `@Injectable({ providedIn: 'root' })`**
3. ✅ **Use `inject()` function** for dependencies
4. ✅ **Use getter for URL** (e.g., `get productsUrl()`)
5. ✅ **Use `this.requestHeaders`** from base class (includes Bearer token)
6. ✅ **Use `this.handleError()`** from base class for error handling
7. ✅ **Use `JSON.stringify()`** for POST/PUT requests
8. ✅ **Return `Observable<T>`** with generic type
9. ✅ **Use `catchError`** with retry logic via `handleError`
10. ✅ **Follow naming**: `get{Action}{Entity}Endpoint` (e.g., `getProductsEndpoint`, `getNewProductEndpoint`)
11. ❌ **DO NOT create HTTP client directly** - extend EndpointBase
12. ❌ **DO NOT handle tokens manually** - EndpointBase does this
13. ❌ **DO NOT forget error handling** - always use `catchError`

### Business Service Pattern (Optional)
For complex business logic, create a separate service:
```typescript
// quickapp.client/src/app/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { ProductEndpoint } from './product-endpoint.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productEndpoint = inject(ProductEndpoint);

  getProducts(): Observable<Product[]> {
    return this.productEndpoint.getProductsEndpoint<Product[]>();
  }

  getProduct(id: number): Observable<Product> {
    return this.productEndpoint.getProductEndpoint<Product>(id);
  }

  createProduct(product: Product): Observable<Product> {
    return this.productEndpoint.getNewProductEndpoint<Product>(product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.productEndpoint.getUpdateProductEndpoint<Product>(product, product.id);
  }

  deleteProduct(id: number): Observable<void> {
    return this.productEndpoint.getDeleteProductEndpoint<void>(id);
  }
}
```

---

## Models

### Model Pattern
```typescript
// quickapp.client/src/app/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: number;
  categoryName?: string;
  createdDate?: string;
  updatedDate?: string;
}
```

### Model Rules
1. ✅ **Use TypeScript interfaces** (not classes for data models)
2. ✅ **Use `?` for optional properties**
3. ✅ **Match ViewModel structure** from backend
4. ✅ **Use camelCase** for property names (TypeScript convention)
5. ✅ **Include audit fields** if needed (`createdDate`, `updatedDate`)
6. ✅ **Flatten navigation properties** (e.g., `categoryName` instead of `category.name`)
7. ❌ **DO NOT use classes** for simple data models
8. ❌ **DO NOT include methods** in model interfaces

---

## Routing

### Route Configuration
Routes are defined in `app.routes.ts`:
```typescript
// quickapp.client/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'Home'
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuard],
    title: 'Products'
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];
```

### Routing Rules
1. ✅ **Use lazy loading** with `loadComponent`
2. ✅ **Use `AuthGuard`** for protected routes
3. ✅ **Set `title`** for each route
4. ✅ **Use `path: ''`** for default route
5. ✅ **Use `path: '**'`** for 404 route (must be last)
6. ❌ **DO NOT use eager loading** - always lazy load feature components
7. ❌ **DO NOT forget AuthGuard** on protected routes

---

## Authorization Guards

### AuthGuard Pattern
The `AuthGuard` is already implemented. Use it in routes:
```typescript
{
  path: 'products',
  loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
  canActivate: [AuthGuard],  // Protects the route
  title: 'Products'
}
```

### Role-Based Access
For role-based access, check in component:
```typescript
import { AccountService } from '../services/account.service';

export class ProductsComponent {
  private accountService = inject(AccountService);

  get canManageProducts(): boolean {
    return this.accountService.userHasPermission('ManageProducts');
  }
}
```

### Authorization Rules
1. ✅ **Use `AuthGuard`** on all protected routes
2. ✅ **Check permissions** in components for UI visibility
3. ✅ **Use `AccountService`** for permission checks
4. ❌ **DO NOT skip AuthGuard** on protected routes
5. ❌ **DO NOT rely only on UI hiding** - backend must also enforce

---

## Error Handling

### AlertService Pattern
```typescript
import { AlertService, MessageSeverity } from '../services/alert.service';

export class ProductsComponent {
  private alertService = inject(AlertService);

  loadData(): void {
    this.alertService.startLoadingMessage();
    
    this.productEndpoint.getProductsEndpoint<Product[]>()
      .subscribe({
        next: products => {
          this.alertService.stopLoadingMessage();
          // Handle success
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(
            'Load Error',
            `Unable to retrieve products.\r\nError: "${this.getErrorMessage(error)}"`,
            MessageSeverity.error,
            error
          );
        }
      });
  }

  private getErrorMessage(error: any): string {
    return error?.error?.message || error?.message || 'Unknown error';
  }
}
```

### Error Handling Rules
1. ✅ **Use `AlertService.startLoadingMessage()`** before async operations
2. ✅ **Use `AlertService.stopLoadingMessage()`** after operations complete
3. ✅ **Use `AlertService.showStickyMessage()`** for errors
4. ✅ **Use `MessageSeverity` enum** (error, warn, info, success)
5. ✅ **Extract error messages** from error object
6. ❌ **DO NOT show raw error objects** to users
7. ❌ **DO NOT forget to stop loading message** on error

---

## Naming Conventions

### Files
- **Components**: `{feature}.component.ts` (e.g., `products.component.ts`)
- **Services**: `{feature}-endpoint.service.ts` or `{feature}.service.ts`
- **Models**: `{feature}.model.ts` (e.g., `product.model.ts`)
- **Templates**: `{feature}.component.html`
- **Styles**: `{feature}.component.scss`

### Classes/Interfaces
- **Components**: PascalCase with `Component` suffix (e.g., `ProductsComponent`)
- **Services**: PascalCase with `Service` or `Endpoint` suffix (e.g., `ProductEndpoint`)
- **Models**: PascalCase interface (e.g., `Product`)

### Methods
- **Data loading**: `loadData()`, `loadProducts()`
- **CRUD operations**: `getProducts()`, `createProduct()`, `updateProduct()`, `deleteProduct()`
- **Event handlers**: `on{Action}()` (e.g., `onProductSelected()`)

### Properties
- **Data arrays**: Plural (e.g., `products`, `customers`)
- **Single items**: Singular (e.g., `product`, `customer`)
- **Loading states**: `loadingIndicator` (boolean)
- **Cache**: `rowsCache` (for filtering/searching)

---

## Component Lifecycle Patterns

### Data Loading Pattern
```typescript
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loadingIndicator = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.productEndpoint.getProductsEndpoint<Product[]>()
      .subscribe({
        next: products => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          this.products = products;
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          // Handle error
        }
      });
  }
}
```

### Form Submission Pattern
```typescript
saveProduct(product: Product): void {
  this.alertService.startLoadingMessage();

  this.productEndpoint.getNewProductEndpoint<Product>(product)
    .subscribe({
      next: savedProduct => {
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('Success', 'Product saved successfully', MessageSeverity.success);
        this.loadData(); // Refresh list
      },
      error: error => {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage('Error', 'Failed to save product', MessageSeverity.error, error);
      }
    });
}
```

---

## Quick Reference Checklist

When creating a new feature component with full CRUD:

- [ ] Create model interface in `models/{feature}.model.ts`
- [ ] Create endpoint service in `services/{feature}-endpoint.service.ts` extending `EndpointBase`
- [ ] Create component in `components/{feature}/{feature}.component.ts`
- [ ] Create template in `components/{feature}/{feature}.component.html`
- [ ] Create styles in `components/{feature}/{feature}.component.scss`
- [ ] Add route in `app.routes.ts` with `AuthGuard`
- [ ] Use `AlertService` for loading states and errors
- [ ] Implement `OnInit` for data loading
- [ ] Use `fadeInOut` animation
- [ ] Import `TranslateModule` for i18n

---

## Common Patterns

### Search/Filter Pattern
```typescript
rowsCache: Product[] = [];
products: Product[] = [];

onSearchChanged(value: string): void {
  const searchValue = value.toLowerCase();
  this.products = this.rowsCache.filter(p => 
    p.name.toLowerCase().includes(searchValue)
  );
}
```

### Table Column Definition
```typescript
columns: TableColumn[] = [
  { prop: 'name', name: 'Name', width: 200 },
  { prop: 'price', name: 'Price', width: 100 },
  { prop: 'categoryName', name: 'Category', width: 150 }
];
```

### Edit/Delete Actions
```typescript
editProduct(product: Product): void {
  // Navigate to edit or open modal
}

deleteProduct(product: Product): void {
  if (confirm('Are you sure you want to delete this product?')) {
    this.alertService.startLoadingMessage();
    this.productEndpoint.getDeleteProductEndpoint<void>(product.id)
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.alertService.showMessage('Success', 'Product deleted', MessageSeverity.success);
          this.loadData();
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Error', 'Failed to delete product', MessageSeverity.error, error);
        }
      });
  }
}
```

---

**Remember**: Follow these patterns exactly. Consistency is what makes AI-assisted development reliable.

