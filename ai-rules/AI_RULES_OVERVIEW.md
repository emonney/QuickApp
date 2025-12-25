# QuickApp AI Development Rules - Overview

**This document provides an overview and quick reference for AI-assisted development with QuickApp.**

## Quick Start

When asking AI to extend QuickApp, include this in your prompt:

```
Reference the AI rules files (in this ai-rules folder):
- AI_RULES_BACKEND.md for ASP.NET Core backend patterns
- AI_RULES_FRONTEND.md for Angular frontend patterns

Follow the exact patterns and conventions documented in these files.
```

## What QuickApp Provides

QuickApp is a **hardened foundation** that solves the hard problems so AI can focus on features:

### ✅ Already Solved (Don't Let AI Recreate)
- **Authentication**: OpenIddict/OAuth2 with JWT tokens
- **Authorization**: Role and permission-based policies
- **Error Handling**: Centralized patterns
- **Logging**: Already wired
- **Validation**: FluentValidation integration
- **Database**: Entity Framework Core with migrations
- **API Structure**: Consistent controller patterns
- **Frontend Auth**: Guards and token management
- **Service Layer**: EndpointBase with automatic token refresh

### 🎯 What AI Should Build
- **New Entities**: Following BaseEntity pattern
- **New Features**: Following existing CRUD patterns
- **UI Components**: Following Angular component structure
- **Business Logic**: In services, not controllers or components

## Architecture Overview

### Backend (ASP.NET Core)
```
QuickApp.Core/          # Domain layer (entities, services)
QuickApp.Server/        # API layer (controllers, ViewModels, authorization)
```

**Key Patterns:**
- Entities inherit `BaseEntity`
- Services use DbContext directly (no repository pattern)
- Controllers inherit `BaseApiController`
- ViewModels use FluentValidation
- AutoMapper for entity ↔ ViewModel conversion

### Frontend (Angular)
```
quickapp.client/src/app/
  components/           # Feature components (lazy-loaded)
  services/            # API services (extend EndpointBase)
  models/              # TypeScript interfaces
```

**Key Patterns:**
- Standalone components
- Services extend `EndpointBase`
- Lazy-loaded routes with `AuthGuard`
- `AlertService` for loading/errors

## Common AI Prompts

### Adding a New Entity (Full Stack)

**Prompt:**
```
Add a new Invoice entity with full CRUD operations following QuickApp patterns.

Reference (files in this ai-rules folder):
- AI_RULES_BACKEND.md for backend patterns
- AI_RULES_FRONTEND.md for frontend patterns

Create:
1. Entity (Invoice.cs) inheriting BaseEntity
2. ViewModel (InvoiceVM.cs) with validator
3. Service interface and implementation
4. Controller with CRUD endpoints
5. AutoMapper configuration
6. Angular model interface
7. Angular endpoint service
8. Angular component with list view
9. Route configuration

Follow the exact patterns from Customer/Product examples.
```

### Adding Authorization

**Prompt:**
```
Add role-based authorization to the Invoice entity:
- ViewAllInvoicesPolicy: Requires ViewInvoices permission
- ManageAllInvoicesPolicy: Requires ManageInvoices permission

Reference AI_RULES_BACKEND.md authorization section (in this ai-rules folder).

Update:
1. AuthPolicies.cs with new policies
2. Program.cs to register policies
3. Controller endpoints with [Authorize] attributes
4. ApplicationPermissions.cs with new permission constants
```

### Adding a New UI Feature

**Prompt:**
```
Add an invoice management page following the customers component pattern.

Reference AI_RULES_FRONTEND.md (in this ai-rules folder).

Create:
1. Invoice model interface
2. InvoiceEndpoint service extending EndpointBase
3. InvoicesComponent with data table
4. Route with AuthGuard
5. Template with ngx-datatable

Use AlertService for loading states and errors.
Follow the exact structure from customers.component.ts.
```

## Pattern Reference

### Backend Entity → Frontend Component Flow

1. **Entity** (`QuickApp.Core/Models/Shop/Invoice.cs`)
   - Inherits `BaseEntity`
   - Defines domain model

2. **ViewModel** (`QuickApp.Server/ViewModels/Shop/InvoiceVM.cs`)
   - API contract
   - FluentValidation rules

3. **Service** (`QuickApp.Core/Services/Shop/InvoiceService.cs`)
   - Business logic
   - DbContext operations

4. **Controller** (`QuickApp.Server/Controllers/InvoiceController.cs`)
   - Inherits `BaseApiController`
   - Maps Entity ↔ ViewModel
   - Authorization

5. **AutoMapper** (`QuickApp.Server/Configuration/MappingProfile.cs`)
   - Entity ↔ ViewModel mapping

6. **Frontend Model** (`quickapp.client/src/app/models/invoice.model.ts`)
   - TypeScript interface
   - Matches ViewModel structure

7. **Endpoint Service** (`quickapp.client/src/app/services/invoice-endpoint.service.ts`)
   - Extends `EndpointBase`
   - HTTP methods

8. **Component** (`quickapp.client/src/app/components/invoices/invoices.component.ts`)
   - Uses endpoint service
   - Handles UI state

9. **Route** (`quickapp.client/src/app/app.routes.ts`)
   - Lazy-loaded
   - Protected with `AuthGuard`

## Critical Rules

### ❌ Never Do This
- Don't create new authentication mechanisms
- Don't bypass BaseApiController
- Don't access DbContext from controllers
- Don't put business logic in controllers
- Don't create new error handling patterns
- Don't skip authorization
- Don't use eager loading in Angular
- Don't make HTTP calls without EndpointBase

### ✅ Always Do This
- Inherit from BaseEntity for entities
- Inherit from BaseApiController for controllers
- Extend EndpointBase for API services
- Use AuthGuard on protected routes
- Use AlertService for loading/errors
- Use AutoMapper for entity ↔ ViewModel
- Use FluentValidation for ViewModels
- Follow naming conventions exactly

## File Structure Quick Reference

### Backend
```
QuickApp.Core/Models/Shop/Invoice.cs
QuickApp.Core/Services/Shop/Interfaces/IInvoiceService.cs
QuickApp.Core/Services/Shop/InvoiceService.cs
QuickApp.Server/ViewModels/Shop/InvoiceVM.cs
QuickApp.Server/Controllers/InvoiceController.cs
QuickApp.Server/Configuration/MappingProfile.cs (update)
QuickApp.Server/Program.cs (register service)
```

### Frontend
```
quickapp.client/src/app/models/invoice.model.ts
quickapp.client/src/app/services/invoice-endpoint.service.ts
quickapp.client/src/app/components/invoices/invoices.component.ts
quickapp.client/src/app/components/invoices/invoices.component.html
quickapp.client/src/app/components/invoices/invoices.component.scss
quickapp.client/src/app/app.routes.ts (add route)
```

## Testing Your AI-Generated Code

### Backend Checklist
- [ ] Entity inherits BaseEntity
- [ ] ViewModel has FluentValidation
- [ ] Service registered in Program.cs
- [ ] Controller inherits BaseApiController
- [ ] AutoMapper mapping added
- [ ] Authorization policies applied
- [ ] Swagger shows endpoints

### Frontend Checklist
- [ ] Service extends EndpointBase
- [ ] Component uses inject() not constructor
- [ ] Route has AuthGuard
- [ ] AlertService used for loading/errors
- [ ] Component is standalone
- [ ] Template uses TranslateModule
- [ ] Animation (fadeInOut) included

## Getting Help

If AI-generated code doesn't follow patterns:

1. **Point to specific rule**: "Follow the BaseApiController pattern from ai-rules/AI_RULES_BACKEND.md"
2. **Show example**: "Use the CustomerController as a reference"
3. **Be specific**: "The service should extend EndpointBase, not HttpClient directly"

## Example: Complete Feature Request

```
Add a complete Invoice management feature to QuickApp.

Backend (reference AI_RULES_BACKEND.md in this folder):
1. Create Invoice entity in QuickApp.Core/Models/Shop/ inheriting BaseEntity
   - Properties: InvoiceNumber (string), Date (DateTime), Amount (decimal), CustomerId (int)
   - Navigation: Customer (Customer), InvoiceItems (ICollection<InvoiceItem>)
   
2. Create InvoiceVM in QuickApp.Server/ViewModels/Shop/ with FluentValidation
   - Validate InvoiceNumber is required and unique
   - Validate Amount > 0
   
3. Create IInvoiceService and InvoiceService in QuickApp.Core/Services/Shop/
   - Methods: GetAllInvoices(), GetInvoiceById(int), CreateInvoiceAsync(Invoice), UpdateInvoiceAsync(Invoice), DeleteInvoiceAsync(int)
   - Use ApplicationDbContext with Include() for Customer
   
4. Create InvoiceController in QuickApp.Server/Controllers/
   - Inherit BaseApiController
   - Full CRUD endpoints with [Authorize]
   - Use AutoMapper for Entity ↔ ViewModel conversion
   
5. Add AutoMapper mapping in MappingProfile.cs
6. Register IInvoiceService in Program.cs

Frontend (reference AI_RULES_FRONTEND.md in this folder):
1. Create Invoice model interface in models/invoice.model.ts
2. Create InvoiceEndpoint service extending EndpointBase
3. Create InvoicesComponent with:
   - Data table showing invoices
   - Load data on init
   - Use AlertService for loading/errors
   - Standalone component with fadeInOut animation
4. Add route in app.routes.ts with AuthGuard

Follow the exact patterns from Customer/Product examples. Don't create new patterns.
```

---

**Remember**: QuickApp provides the foundation. AI fills in features following established patterns. Consistency is key.

