# **QuickApp** - The AI-Ready Reference Architecture for Angular 21 / ASP.NET Core 10 Projects

[![MIT license](https://cdn.rawgit.com/emonney/tempa/7e9d69ad/MITLicense.png)](https://github.com/emonney/QuickApp/blob/master/LICENSE)
[![VSIX Downloads](https://img.shields.io/visual-studio-marketplace/d/adentum.QuickApp-ASPNETCoreAngularXProjectTemplate)](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate)
[![Twitter Follow](https://img.shields.io/twitter/follow/kommand?style=social)](https://twitter.com/kommand)
[![YouTube Channel](https://img.shields.io/youtube/channel/subscribers/@EbenMonney?label=YouTube&style=social)](https://www.youtube.com/@EbenMonney)

**A hardened full-stack foundation designed to be safely extended by AI.**

QuickApp is an opinionated Angular 21 + ASP.NET Core 10 starter that solves the *boring, fragile, and security-sensitive* parts of modern web applications—authentication, authorization, role and user management, error handling, and architectural consistency—so that **AI tools (ChatGPT, Copilot, Claude, Cursor, etc.) can safely build on top of it**.

> **Stop letting AI hallucinate your Auth and DB logic—give it a production-grade foundation to build on.**

<div align="center" style="margin: 20px 0;">
  <a href="https://www.youtube.com/@EbenMonney" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #FF0000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
    📺 Subscribe on YouTube
  </a>
</div>

[![QuickApp Demo](https://github.com/emonney/QuickApp/blob/9b122b7f3c38121699d3ec41b700474e192abe37/QuickApp.gif?raw=true)](https://www.youtube.com/watch?v=Wuh7NIZ96jA)

[LIVE DEMO](https://quickapp-standard.ebenmonney.com) | [Video Demo](https://www.youtube.com/watch?v=Wuh7NIZ96jA) | [📺 YouTube Channel](https://www.youtube.com/@EbenMonney)

---

## Why QuickApp Exists (in the Age of AI)

AI can generate code fast. It is also very good at:
- ✅ Generating new features
- ✅ Repeating existing patterns
- ✅ Filling in CRUD features
- ✅ Extending UI and API layers

AI is **not good at**:
- ❌ Designing secure authentication flows
- ❌ Maintaining architectural consistency over time
- ❌ Enforcing authorization rules correctly
- ❌ Making long-lived projects stable

**QuickApp provides a known-good foundation** where those hard problems are already solved. You start with QuickApp, then let AI extend the application *inside guardrails*.

Think of it as:

> **The boring, correct core that lets AI do the exciting work without breaking everything.**

---

## How QuickApp Makes AI Development 10x More Reliable

### AI-Optimized Foundation

QuickApp provides a **standardized foundation** that gives your chosen AI a set of "Laws" to follow. The AI's output becomes 10x more reliable because it isn't guessing the infrastructure; it's just filling in the features.

### Architectural Governance

- **Secure auth already done correctly** - OpenIddict/OAuth2 with JWT tokens, refresh token handling, and proper claims management
- **Complete role and user management system** - Full user CRUD, role assignment, permission-based access control, policy-based authorization, resource-based authorization, and custom authorization handlers
- **Authorization patterns already enforced** - Role and permission-based policies with custom authorization handlers
- **Error handling, logging, validation already wired** - Centralized patterns that AI-generated code automatically inherits
- **Consistent structure** - One obvious way to add features, making AI prompts predictable

AI then fills in features **inside these guardrails**, not by inventing new patterns.

### Designed to be Extended via AI Prompts

QuickApp is intentionally structured so AI tools can extend it safely and predictably:

- **Explicit patterns** - BaseEntity, BaseApiController, EndpointBase service patterns that AI can follow
- **Predictable folder structure** - Controllers, Services, ViewModels, Components organized consistently
- **One preferred way** - Clear conventions reduce AI guesswork

AI performs best when the rules are clear. QuickApp makes the rules boring and obvious.

---

## What You Get Out of the Box

### Backend (ASP.NET Core 10)
- ✅ **JWT-based authentication** with OpenIddict/OAuth2
- ✅ **Complete user and role management system** - User CRUD operations, role assignment, permission-based access control, policy-based and resource-based authorization with custom handlers
- ✅ **Role and permission-based authorization** with custom policies and handlers
- ✅ **Clean API layering** - BaseApiController with consistent error handling
- ✅ **DTO patterns** - AutoMapper integration for ViewModels
- ✅ **Centralized validation** - Model sanitization and error handling
- ✅ **Entity Framework Core** - Code First migrations with audit trails
- ✅ **Repository and Unit of Work patterns** - Structured data access
- ✅ **Swagger/OpenAPI** - Auto-generated API documentation
- ✅ **Logging and configuration** - Already wired and ready

### Frontend (Angular 21)
- ✅ **Authentication and authorization guards** - Route protection built-in
- ✅ **Complete user and role management UI** - Full admin interface for managing users, roles, and permissions with intuitive controls
- ✅ **Consistent service patterns** - EndpointBase with automatic token refresh
- ✅ **Structured component architecture** - Standalone components with lazy loading
- ✅ **Bootstrap 5 theming** - Responsive design out of the box
- ✅ **Internationalization** - Multi-language support
- ✅ **Token management** - Automatic refresh token handling

### Architecture
- ✅ **Opinionated but extensible** - Clear patterns, easy to extend
- ✅ **One obvious way** - Reduces decision fatigue
- ✅ **AI-friendly patterns** - Structure that AI tools can reliably follow

---

## How to Use QuickApp with AI

### 1. Start from QuickApp
```bash
# Clone the repository
git clone https://github.com/emonney/QuickApp.git
cd QuickApp

# Restore dependencies
dotnet restore
cd quickapp.client
npm install

# Run the application
# Backend: F5 or dotnet run
# Frontend: npm start
```

Verify authentication, roles, and base features work.

### 2. Let AI Extend It

Use prompts like:

> **"Add a new `Invoice` entity following the existing `Product` pattern (API, DTO, Angular service, and UI)."**

> **"Add role-based access so only `Admin` users can create or delete invoices."**

> **"Create a new Angular component for invoice management that matches the existing customers component structure."**

### 3. Review, Not Reinvent
- AI fills in features following QuickApp's patterns
- QuickApp ensures structure, security, and consistency
- You review and refine, not rebuild from scratch

### Why This Works

- **Patterns are explicit** - BaseEntity, BaseApiController, EndpointBase show AI exactly what to follow
- **Folder structure is predictable** - Controllers, Services, ViewModels, Components in expected places
- **There is one preferred way** - Less ambiguity = better AI output

---

## What This Project Is (and Is Not)

### QuickApp **is**:
- ✅ A production-ready foundation
- ✅ A stable substrate for AI code generation
- ✅ A reference architecture you can trust
- ✅ Guardrails instead of scaffolding
- ✅ The perfect context-base for Claude, Copilot, and Cursor

### QuickApp **is not**:
- ❌ A replacement for AI tools
- ❌ A magic generator that writes your entire app
- ❌ A one-click solution for every use case
- ❌ Just another starter template

---

## Who This Is For

- 🎯 **Developers using AI** to accelerate full-stack development
- 🎯 **Teams that want speed** *without* architectural chaos
- 🎯 **Solo developers** who don't trust AI with auth and security
- 🎯 **Enterprise projects** that need predictable structure
- 🎯 **Anyone tired of** AI-generated codebases that slowly collapse under their own weight

---

## Installation

### Option 1: Clone from Git
```bash
git clone https://github.com/emonney/QuickApp.git
```

### Option 2: Visual Studio Template
Install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate) and use **File → New Project → Web → QuickApp**.

### Setup Steps

1. **Restore dependencies:**
   ```bash
   # Backend
   dotnet restore
   
   # Frontend
   cd quickapp.client
   npm install
   ```

2. **Configure database connection** in `appsettings.json`

3. **Run migrations:**
   ```bash
   dotnet ef database update
   ```

4. **Launch:**
   - Backend: `F5` or `dotnet run` from `QuickApp.Server`
   - Frontend: `npm start` from `quickapp.client`

### Default Login Credentials

**Administrator Account:**
- Username: `admin`
- Email: `admin@ebenmonney.com`
- Password: `tempP@ss123`

**Standard Account:**
- Username: `user`
- Email: `user@ebenmonney.com`
- Password: `tempP@ss123`

> **Note:** Change these passwords immediately in production!

---

## Prompting Guidelines for AI Tools

### Quick Start

**Always include this in your AI prompts:**

```
Reference the AI rules file: ai-rules/AI_RULES.md

Follow the exact patterns and conventions documented in this file.
Reference UserAccountController, UserRoleController, and UserVMs.cs for real implementation examples.
```

### Detailed Guidelines

When using AI tools with QuickApp, reference existing patterns explicitly:

- ✅ **"Reference ai-rules/AI_RULES.md"** - Complete development rules for backend and frontend patterns
- ✅ **"Match the authorization approach used in UserAccountController"** - Point to `UserAccountController.cs`
- ✅ **"Follow the CRUD patterns from UserRoleController"** - Reference `UserRoleController.cs`
- ✅ **"Use the same ViewModel validation pattern as UserVMs"** - Reference `UserVMs.cs`
- ✅ **"Reuse the Angular service and component conventions"** - Reference existing endpoint services and components
- ✅ **"Follow the BaseApiController error handling pattern"** - Reference the base controller

### Example Prompt

```
Add a new Invoice entity with full CRUD operations following QuickApp patterns.

Reference: ai-rules/AI_RULES.md

Create:
1. Entity (Invoice.cs) inheriting BaseEntity
2. ViewModel (InvoiceVM.cs) with DataAnnotations validation
3. Service interface and implementation
4. Controller with CRUD endpoints (inherit BaseApiController)
5. AutoMapper configuration
6. Angular model interface
7. Angular endpoint service (extend EndpointBase)
8. Angular component with list view
9. Route configuration with AuthGuard
10. Translation keys in locale files

Follow the exact patterns from UserAccountController and UserRoleController examples.
```

**Clear prompts + stable foundation + comprehensive rules = fewer rewrites.**

---

## Technical Stack

### Backend
- **ASP.NET Core 10** - Cross-platform web framework
- **Entity Framework Core** - Code First ORM
- **OpenIddict** - OAuth2/OIDC authentication
- **AutoMapper** - Object-to-object mapping
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Angular 21** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - Responsive UI framework
- **RxJS** - Reactive programming

---

## Philosophy

QuickApp embraces AI-assisted development **without pretending AI replaces engineering discipline**.

The goal is simple:
- **Humans decide architecture** - You choose QuickApp's patterns
- **QuickApp enforces it** - Structure and security are built-in
- **AI does the repetitive work** - Features, CRUD, UI components

**Stable architecture that resists AI-generated spaghetti.**

**Minimizes rework when AI code gets it half-right.**

---

## Additional Resources

### Premium Versions
- [QuickApp PRO](https://www.ebenmonney.com/product/quickapp-pro) | [Live Demo](http://quickapp-pro.ebenmonney.com/)
- [QuickApp STANDARD](https://www.ebenmonney.com/product/quickapp-standard) | [Live Demo](http://quickapp-standard.ebenmonney.com/)

### Documentation
- [QuickApp Overview](https://www.ebenmonney.com/quickapp)
- [📺 YouTube Channel - Tutorials & Walkthroughs](https://www.youtube.com/@EbenMonney) - Learn QuickApp through video tutorials
- [ASP.NET Core Documentation](https://go.microsoft.com/fwlink/?LinkId=518008)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/#pivot=efcore)
- [Angular Documentation](https://angular.dev/overview)

### Support
- [Support Forum](https://www.ebenmonney.com/support/forum/product-support)
- [GitHub Issues](https://github.com/emonney/QuickApp/issues)
- [Become a Sponsor](https://github.com/sponsors/emonney) - Get access to PRO/STANDARD versions and priority support

---

## Contribution

QuickApp is actively maintained on [GitHub](https://github.com/emonney/QuickApp). You can support it by:
- ⭐ [Starring the repository](https://github.com/emonney/QuickApp)
- 💰 [Sponsoring on GitHub](https://github.com/sponsors/emonney)
- ⭐ [Rating on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate#review-details)
- 🔧 Submitting pull requests
- 💡 Suggesting improvements
- 📢 Sharing with others

---

## License

Released under the [MIT License](https://github.com/emonney/QuickApp/blob/master/LICENSE).

---

**If you are tired of AI-generated codebases that slowly collapse under their own weight, start from something solid.**

[YOUR FEEDBACK](mailto:feedback@ebenmonney.com) | [FOLLOW ME](https://twitter.com/kommand) | [📺 SUBSCRIBE ON YOUTUBE](https://www.youtube.com/@EbenMonney)

---

### _**If you found this template useful, please take a minute to [rate it](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate#review-details). Appreciated!**_
