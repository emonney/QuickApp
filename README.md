# **QuickApp** - ASPNET Core 7 / Angular 16 project template
[![MIT license](https://cdn.rawgit.com/emonney/tempa/7e9d69ad/MITLicense.png)](https://github.com/emonney/QuickApp/blob/master/LICENSE)
[![VSIX Downloads](https://img.shields.io/visual-studio-marketplace/d/adentum.QuickApp-ASPNETCoreAngularXProjectTemplate)](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate)
[![Twitter Follow](https://img.shields.io/twitter/follow/kommand?style=social)](https://twitter.com/kommand)

A startup **Angular 16 / ASP.NET Core 7** (cross-platform ) **project template** with an end-to-end login, user and role management implementation.
As well as other common functionalities for **Quick Application Development**.

[FOLLOW ME](https://twitter.com/kommand) on twitter for important updates

###### NOTE: Please post support related topics in the [help & support forum](https://www.ebenmonney.com/support/forum/product-support). For bug reports open an [issue on github](https://github.com/emonney/QuickApp/issues). 

For the older asp.net core 1.x version: [Download](https://github.com/emonney/QuickApp-VSIX/releases/tag/v1.5")

[LIVE DEMO](http://quickapp.ebenmonney.com) | [MORE TEMPLATES](https://www.ebenmonney.com/templates)
[![QuickApp Intro](https://github.com/emonney/QuickApp/raw/32736e9af078df258beb38b1d351b232237d8410/YouTube-Intro.png)](https://www.youtube.com/watch?v=R6LyABsq_fY)

___
## INTRODUCING QUICKAPP PREMIUM TEMPLATES
*   All free features
*   Angular Material
*	Reactive forms
*	Public Registration, Password Recovery & Reset, Email Confirmation
*   Priority Email Support
*   Etc

[Get QuickApp PRO](https://www.ebenmonney.com/product/quickapp-pro) | [Live Demo](http://quickapp-pro.ebenmonney.com/)

[Get QuickApp STANDARD](https://www.ebenmonney.com/product/quickapp-standard) | [Live Demo](http://quickapp-standard.ebenmonney.com/)
___



## This application consists of:

*   Template pages with Angular 16 and TypeScript
*   RESTful API Backend using ASP.NET Core 7 Web API
*   Database using Entity Framework Core
*   Authentication based on IdentityServer and ASP.NET Core Identity
*   API Documentation using Swagger
*   Angular CLI for managing client-side libraries
*   Theming using Bootstrap 5

## You get the benefits of:

*   A complete backend and frontend project structure to build on, with login, user and permission-based role management already integrated
*   Data Access Layer built with the Repository and Unit of Work Pattern
*   Code First Database
*   A RESTful API Design
*   Angular Directives Quidance
*   Angular Pipes Quidance
*   Angular Animations Quidance
*   Angular Services
*   Dialog and Notification Services
*   Configuration Page and Configuration Service
*   Integrated Internationalization
*   Theming with SASS
*   Ready-to-use email API
*   Handling Access and Refresh Tokens with WebStorage (Bearer authentication) - No Cookies
*   CRUD APIs
*   Responsive Design
*   Etc.


## Installation

*   [OPTION 1] Clone the [Git Repository](https://github.com/emonney/QuickApp.git) and edit with your favorite editor. e.g. Visual Studio, Visual Studio Code
*   [OPTION 2] Install Project template from the [Visual Studio Gallery](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate) and follow the usual File -> New Project -> Web -> QuickApp - to create a new Project from this template.
    Lunch with `F5` or `Ctrl+F5` (The usual way)


## Installation Notes

*   When creating a new project please wait for all dependencies to be restored; "dotnet restore" for asp.net project & "npm install" for angular project.
    When using VisualStudio this is automatic, check the output window or status bar to know that the package/dependencies restore process is complete before launching your program for the first time.
*   If you get any errors, consider running manually the steps to build the project and note where the errors occur.
    Open command prompt and do the below steps:  
    1. run 'dotnet restore' from the two project folders - Restore nuget packages
	2. run 'npm install' from the project with package.json - Restore npm packages
	3. Try running the application again - Test to make sure it all works
*	When running the client(angular) project on a different address/domain from the backend, configure the baseUrl of the client to match that of the server.
	You do this from environment.ts in the ClientApp/Angular project.
	Example: baseUrl: "http://yourbackendserver.com" OR baseUrl: "http://localhost:5050"
*	For help and support post in the [support forum](https://www.ebenmonney.com/support/forum/product-support)
*	For bug reports open an [issue on github](https://github.com/emonney/QuickApp/issues)


## Login

LOGIN WITH USERNAME OR EMAIL ADDRESS
> * **Default Administrator Account**
>   * Username: admin
>   * Email:    admin@ebenmonney.com
>   * Password: tempP@ss123
> * **Default Standard Account**
>   * Username: user
>   * Email:    user@ebenmonney.com
>   * Password: tempP@ss123


## Documentation

*   [Overview of QuickApp](https://www.ebenmonney.com/quickapp)
*   [Conceptual overview of what is ASP.NET Core](https://go.microsoft.com/fwlink/?LinkId=518008)
*   [Working with Data](https://docs.microsoft.com/en-us/ef/#pivot=efcore)
*   [Angular 16 documentation overview](https://angular.io/guide/quickstart)
*   [Getting started with Angular CLI](https://cli.angular.io)
*   [Introduction to Bootstrap 5](https://getbootstrap.com/docs/5.2/getting-started/introduction)


## Contribution

QuickApp is actively maintained by [Ebenezer Monney](https://github.com/emonney) on [GitHub](https://github.com/emonney/QuickApp). You can support it by
*   Submitting your changes/improvements/features using pull requests
*   Suggesting ideas or areas of improvements
*   Encouraging the developers by rating it/starring it
*   Linking to it and recommending it to others
*   [Making a donation](https://paypal.me/ebenmonney)


## License

Released under the [MIT License](https://github.com/emonney/QuickApp/blob/master/LICENSE).

[YOUR FEEDBACK](mailto:contact@ebenmonney.com) | [FOLLOW ME](https://twitter.com/kommand)

### _**If you found this template useful, please take a minute to [rate it](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngularXProjectTemplate#review-details). Appreciated!**_
