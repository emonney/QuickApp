# QuickApp Backend AI Development Rules

**Reference this file in your AI prompts when extending the QuickApp backend.**

## Table of Contents
1. [Project Structure](#project-structure)
2. [Entity Models](#entity-models)
3. [ViewModels (DTOs)](#viewmodels-dtos)
4. [Services](#services)
5. [Controllers](#controllers)
6. [Authorization](#authorization)
7. [AutoMapper Configuration](#automapper-configuration)
8. [Error Handling](#error-handling)
9. [Naming Conventions](#naming-conventions)

---

## Project Structure

### Folder Organization
```
QuickApp.Core/
  ├── Models/           # Domain entities
  │   ├── Account/      # User, Role, Permission entities
  │   └── Shop/         # Business domain entities (Product, Customer, Order, etc.)
  ├── Services/         # Business logic interfaces and implementations
  │   ├── Account/      # User/Role services
  │   └── Shop/         # Business domain services
  └── Infrastructure/  # DbContext, Database seeding

QuickApp.Server/
  ├── Controllers/      # API controllers
  ├── ViewModels/       # DTOs for API responses/requests
  ├── Authorization/   # Policies, requirements, handlers
  ├── Configuration/    # AutoMapper, OIDC config
  └── Attributes/       # Custom action filters
```

### Key Principles
- **Separation of Concerns**: Models in Core, ViewModels in Server
- **Dependency Direction**: Server depends on Core, never the reverse
- **One Entity Per File**: Each entity, service, controller in its own file

---

## Entity Models

### Base Pattern
**ALL entities MUST inherit from `BaseEntity`** which provides:
- `Id` (int)
- `CreatedBy`, `UpdatedBy` (string?, max 40 chars)
- `CreatedDate`, `UpdatedDate` (DateTime)

### Example Entity
```csharp
// QuickApp.Core/Models/Shop/Product.cs
namespace QuickApp.Core.Models.Shop
{
    public class Product : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        
        // Navigation properties
        public int CategoryId { get; set; }
        public required Category Category { get; set; }
        
        public ICollection<OrderDetail> OrderDetails { get; } = [];
    }
}
```

### Entity Rules
1. ✅ **MUST inherit from `BaseEntity`**
2. ✅ **Use `required` keyword for non-nullable reference types**
3. ✅ **Use `string?` for optional string properties**
4. ✅ **Navigation properties use `ICollection<T>` with initializer `[]`**
5. ✅ **Foreign keys follow pattern: `{RelatedEntity}Id`**
6. ✅ **Navigation property name matches related entity (e.g., `Category Category`)**
7. ❌ **DO NOT add validation attributes to entities** (use ViewModels)
8. ❌ **DO NOT add business logic to entities** (use Services)

### File Header
Every file MUST start with:
```csharp
// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------
```

---

## ViewModels (DTOs)

### Location
ViewModels go in `QuickApp.Server/ViewModels/{Domain}/` (e.g., `ViewModels/Shop/`)

### Pattern
```csharp
// QuickApp.Server/ViewModels/Shop/ProductVM.cs
using FluentValidation;

namespace QuickApp.Server.ViewModels.Shop
{
    public class ProductVM
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; } // Flattened navigation property
    }

    public class ProductViewModelValidator : AbstractValidator<ProductVM>
    {
        public ProductViewModelValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty()
                .WithMessage("Product name cannot be empty")
                .MaximumLength(100)
                .WithMessage("Product name cannot exceed 100 characters");
            
            RuleFor(p => p.Price)
                .GreaterThan(0)
                .WithMessage("Price must be greater than zero");
        }
    }
}
```

### ViewModel Rules
1. ✅ **Use `VM` suffix** (e.g., `ProductVM`, `CustomerVM`)
2. ✅ **Include FluentValidation validator in same file**
3. ✅ **Flatten navigation properties** when needed (e.g., `CategoryName` instead of `Category.Name`)
4. ✅ **Use nullable reference types** (`string?`) for optional fields
5. ✅ **Include `Id` for updates, exclude for creates**
6. ❌ **DO NOT include navigation collections** unless specifically needed
7. ❌ **DO NOT duplicate entity logic** - ViewModels are for API contracts only

---

## Services

### Interface Location
Interfaces go in `QuickApp.Core/Services/{Domain}/Interfaces/`

### Implementation Location
Implementations go in `QuickApp.Core/Services/{Domain}/`

### Pattern
```csharp
// QuickApp.Core/Services/Shop/Interfaces/IProductService.cs
using QuickApp.Core.Models.Shop;

namespace QuickApp.Core.Services.Shop
{
    public interface IProductService
    {
        IEnumerable<Product> GetAllProducts();
        Product? GetProductById(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task DeleteProductAsync(int id);
    }
}

// QuickApp.Core/Services/Shop/ProductService.cs
using Microsoft.EntityFrameworkCore;
using QuickApp.Core.Infrastructure;
using QuickApp.Core.Models.Shop;

namespace QuickApp.Core.Services.Shop
{
    public class ProductService(ApplicationDbContext dbContext) : IProductService
    {
        public IEnumerable<Product> GetAllProducts()
        {
            return dbContext.Products
                .Include(p => p.Category)
                .OrderBy(p => p.Name)
                .ToList();
        }

        public Product? GetProductById(int id)
        {
            return dbContext.Products
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            dbContext.Products.Add(product);
            await dbContext.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            dbContext.Products.Update(product);
            await dbContext.SaveChangesAsync();
            return product;
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await dbContext.Products.FindAsync(id);
            if (product != null)
            {
                dbContext.Products.Remove(product);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}
```

### Service Rules
1. ✅ **Use primary constructor** for dependency injection (C# 12)
2. ✅ **Inject `ApplicationDbContext`** directly, not repository pattern
3. ✅ **Use `Include()` for eager loading** navigation properties
4. ✅ **Use async/await** for database operations
5. ✅ **Return `IEnumerable<T>`** for collections, `T?` for single items
6. ✅ **Use `AsSingleQuery()`** for complex includes to avoid cartesian explosion
7. ❌ **DO NOT use repository pattern** - use DbContext directly
8. ❌ **DO NOT add ViewModels to Core project** - only entities
9. ❌ **DO NOT add authorization logic** - that belongs in controllers

### Service Registration
Register in `Program.cs`:
```csharp
builder.Services.AddScoped<IProductService, ProductService>();
```

---

## Controllers

### Base Controller
**ALL controllers MUST inherit from `BaseApiController`** which provides:
- `_mapper` (IMapper)
- `_logger` (ILogger)
- `GetCurrentUserId()` method
- `AddModelError()` methods

### Pattern
```csharp
// QuickApp.Server/Controllers/ProductController.cs
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.Services.Shop;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;

        public ProductController(
            ILogger<ProductController> logger,
            IMapper mapper,
            IProductService productService) : base(logger, mapper)
        {
            _productService = productService;
        }

        [HttpGet]
        [Authorize] // Or specific policy
        [ProducesResponseType(200, Type = typeof(IEnumerable<ProductVM>))]
        public IActionResult Get()
        {
            var products = _productService.GetAllProducts();
            return Ok(_mapper.Map<IEnumerable<ProductVM>>(products));
        }

        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(ProductVM))]
        [ProducesResponseType(404)]
        public IActionResult Get(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
                return NotFound(id);

            return Ok(_mapper.Map<ProductVM>(product));
        }

        [HttpPost]
        [Authorize] // Or specific policy like AuthPolicies.ManageAllProductsPolicy
        [ProducesResponseType(201, Type = typeof(ProductVM))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Post([FromBody] ProductVM productVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = _mapper.Map<Product>(productVM);
            var createdProduct = await _productService.CreateProductAsync(product);
            var createdVM = _mapper.Map<ProductVM>(createdProduct);

            return CreatedAtAction(nameof(Get), new { id = createdVM.Id }, createdVM);
        }

        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(ProductVM))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Put(int id, [FromBody] ProductVM productVM)
        {
            if (id != productVM.Id)
                return BadRequest("ID mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingProduct = _productService.GetProductById(id);
            if (existingProduct == null)
                return NotFound(id);

            _mapper.Map(productVM, existingProduct);
            var updatedProduct = await _productService.UpdateProductAsync(existingProduct);
            
            return Ok(_mapper.Map<ProductVM>(updatedProduct));
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
                return NotFound(id);

            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
```

### Controller Rules
1. ✅ **MUST inherit from `BaseApiController`**
2. ✅ **Use `[Route("api/[controller]")]`** attribute
3. ✅ **Use `[ApiController]`** attribute
4. ✅ **Use `[Authorize]`** on all endpoints (or specific policies)
5. ✅ **Use `[ProducesResponseType]`** attributes for Swagger documentation
6. ✅ **Use AutoMapper** to convert between entities and ViewModels
7. ✅ **Return `IActionResult`** (not concrete types)
8. ✅ **Use HTTP status codes**: 200 (OK), 201 (Created), 204 (NoContent), 400 (BadRequest), 404 (NotFound)
9. ✅ **Use `CreatedAtAction`** for POST responses
10. ✅ **Validate ModelState** before processing
11. ❌ **DO NOT access DbContext directly** - use services
12. ❌ **DO NOT put business logic in controllers** - delegate to services
13. ❌ **DO NOT return entities directly** - always map to ViewModels

---

## Authorization

### Policy-Based Authorization
Define policies in `QuickApp.Server/Authorization/AuthPolicies.cs`:
```csharp
public static class AuthPolicies
{
    public const string ViewAllProductsPolicy = "View All Products";
    public const string ManageAllProductsPolicy = "Manage All Products";
}
```

Register in `Program.cs`:
```csharp
builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AuthPolicies.ViewAllProductsPolicy,
        policy => policy.RequireClaim(CustomClaims.Permission, ApplicationPermissions.ViewProducts))
    .AddPolicy(AuthPolicies.ManageAllProductsPolicy,
        policy => policy.RequireClaim(CustomClaims.Permission, ApplicationPermissions.ManageProducts));
```

### Resource-Based Authorization
For resource-specific authorization (e.g., user can only edit their own data):

1. Create requirement:
```csharp
// QuickApp.Server/Authorization/Requirements/ProductAuthorizationRequirement.cs
public class ProductAuthorizationRequirement(string operationName) : IAuthorizationRequirement
{
    public string OperationName { get; private set; } = operationName;
}
```

2. Create handler:
```csharp
public class ManageProductAuthorizationHandler : 
    AuthorizationHandler<ProductAuthorizationRequirement, int>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ProductAuthorizationRequirement requirement,
        int productId)
    {
        // Check if user has permission or owns the product
        if (context.User.HasClaim(CustomClaims.Permission, ApplicationPermissions.ManageProducts))
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
```

3. Register handler in `Program.cs`:
```csharp
builder.Services.AddSingleton<IAuthorizationHandler, ManageProductAuthorizationHandler>();
```

4. Use in controller:
```csharp
[HttpPut("{id}")]
public async Task<IActionResult> Put(int id, [FromBody] ProductVM productVM)
{
    if (!(await _authorizationService.AuthorizeAsync(User, id,
        new ProductAuthorizationRequirement("Update"))).Succeeded)
        return new ChallengeResult();
    
    // ... rest of method
}
```

### Authorization Rules
1. ✅ **Use `[Authorize]`** attribute on all endpoints
2. ✅ **Use policy constants** from `AuthPolicies` class
3. ✅ **Create custom requirements** for resource-based authorization
4. ✅ **Register authorization handlers** in `Program.cs`
5. ❌ **DO NOT hardcode permission strings** - use `ApplicationPermissions` constants
6. ❌ **DO NOT skip authorization** - every endpoint must be protected

---

## AutoMapper Configuration

### Location
Configure mappings in `QuickApp.Server/Configuration/MappingProfile.cs`

### Pattern
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Entity to ViewModel (and reverse)
        CreateMap<Product, ProductVM>()
            .ReverseMap();
        
        // Complex mappings
        CreateMap<Product, ProductVM>()
            .ForMember(d => d.CategoryName, map => map.MapFrom(s => s.Category.Name))
            .ReverseMap()
            .ForMember(d => d.Category, map => map.Ignore());
        
        // Conditional mappings
        CreateMap<ProductVM, Product>()
            .ForMember(d => d.Id, map => map.Condition(src => src.Id != 0));
    }
}
```

### Mapping Rules
1. ✅ **Add mappings for all new entities** to their ViewModels
2. ✅ **Use `ReverseMap()`** when bidirectional mapping is needed
3. ✅ **Use `ForMember()`** to customize property mappings
4. ✅ **Use `Ignore()`** for properties that shouldn't be mapped
5. ✅ **Use `Condition()`** to conditionally map (e.g., only map Id if not 0)
6. ❌ **DO NOT map navigation collections** unless specifically needed
7. ❌ **DO NOT add business logic** in mapping configuration

---

## Error Handling

### Exception Types
Create custom exceptions in `QuickApp.Core/Services/{Domain}/Exceptions/`:
```csharp
namespace QuickApp.Core.Services.Shop.Exceptions
{
    public class ProductNotFoundException : Exception
    {
        public ProductNotFoundException(int id) 
            : base($"Product with ID {id} was not found.")
        {
        }
    }
    
    public class ProductException : Exception
    {
        public ProductException(string message) : base(message) { }
    }
}
```

### Controller Error Handling
```csharp
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    try
    {
        var product = _productService.GetProductById(id);
        if (product == null)
            return NotFound(id);

        await _productService.DeleteProductAsync(id);
        return NoContent();
    }
    catch (ProductException ex)
    {
        _logger.LogError(ex, "Error deleting product {ProductId}", id);
        AddModelError(ex.Message);
        return BadRequest(ModelState);
    }
}
```

### Error Handling Rules
1. ✅ **Use custom exceptions** for domain-specific errors
2. ✅ **Log errors** using `_logger.LogError()`
3. ✅ **Return appropriate HTTP status codes**
4. ✅ **Use `AddModelError()`** from BaseApiController for validation errors
5. ❌ **DO NOT expose internal exceptions** to API responses
6. ❌ **DO NOT swallow exceptions** - log and handle appropriately

---

## Naming Conventions

### Files
- **Entities**: `{EntityName}.cs` (e.g., `Product.cs`)
- **ViewModels**: `{EntityName}VM.cs` (e.g., `ProductVM.cs`)
- **Services**: `{EntityName}Service.cs` (e.g., `ProductService.cs`)
- **Interfaces**: `I{EntityName}Service.cs` (e.g., `IProductService.cs`)
- **Controllers**: `{EntityName}Controller.cs` (e.g., `ProductController.cs`)

### Classes
- **Entities**: PascalCase, singular (e.g., `Product`, `Customer`)
- **ViewModels**: PascalCase with `VM` suffix (e.g., `ProductVM`)
- **Services**: PascalCase with `Service` suffix (e.g., `ProductService`)
- **Controllers**: PascalCase with `Controller` suffix (e.g., `ProductController`)

### Methods
- **Service methods**: Verb + Entity (e.g., `GetProductById`, `CreateProductAsync`)
- **Controller actions**: HTTP verb names (e.g., `Get`, `Post`, `Put`, `Delete`)

### Properties
- **Entities**: PascalCase (e.g., `Name`, `Price`)
- **Foreign keys**: `{RelatedEntity}Id` (e.g., `CategoryId`)
- **Navigation properties**: Entity name (e.g., `Category`, `OrderDetails`)

---

## Quick Reference Checklist

When creating a new entity with full CRUD:

- [ ] Create entity in `QuickApp.Core/Models/{Domain}/{EntityName}.cs` inheriting `BaseEntity`
- [ ] Create ViewModel in `QuickApp.Server/ViewModels/{Domain}/{EntityName}VM.cs` with validator
- [ ] Create interface in `QuickApp.Core/Services/{Domain}/Interfaces/I{EntityName}Service.cs`
- [ ] Create service in `QuickApp.Core/Services/{Domain}/{EntityName}Service.cs`
- [ ] Register service in `Program.cs`
- [ ] Add AutoMapper mappings in `MappingProfile.cs`
- [ ] Create controller in `QuickApp.Server/Controllers/{EntityName}Controller.cs` inheriting `BaseApiController`
- [ ] Add authorization policies if needed
- [ ] Update `ApplicationDbContext` if new DbSet needed
- [ ] Create and run migration: `dotnet ef migrations add Add{EntityName} && dotnet ef database update`

---

**Remember**: Follow these patterns exactly. Consistency is what makes AI-assisted development reliable.

