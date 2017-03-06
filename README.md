# **QuickApp** - ASPNET Core / Angular2 startup project template
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/emonney/QuickApp/blob/master/LICENSE)

A startup **Angular2 / ASP.NET Core** (cross-platform ) **project template** with an end-to-end user and role management implementation.
As well as other common functionalities for Quick Application development.

Download [demo](https://github.com/emonney/tempa/raw/master/QuickApp-PublishOutput.zip)


[![QuickApp Demo](https://github.com/emonney/QuickApp/blob/9b122b7f3c38121699d3ec41b700474e192abe37/QuickApp.gif?raw=true)](https://www.youtube.com/watch?v=Wuh7NIZ96jA)

## This application consists of:

*   Template pages using Angular2 and TypeScript
*   RESTful API Backend using ASP.NET Core MVC Web API
*   Database using Entity Framework Core
*   Authentication based on OpenID Connect
*   API Documentation using Swagger
*   [Webpack2](https://webpack.js.org) for managing client-side libraries
*   Theming using [Bootstrap](https://go.microsoft.com/fwlink/?LinkID=398939)

## You get the benefits of:

*   A complete backend and frontend project structure to build on with user and permission-based role management already integrated
*   Data Access Layer built with the Repository and Unit of Work Pattern
*   Code First Database
*   A RESTful API Design
*   Angular Directives Quidance
*   Angular Pipes Quidance
*   Angular Animations Quidance
*   Angular Services
*   Dialog and Notification Services
*   Configuration Page and Service
*   Theming with SASS
*   Handling Access and Refresh Tokens with WebStorage (Bearer authentication) - No Cookies
*   Jquery Integration (Example of using standard Jquery libraries)
*   CRUD APIs


## Installation

*   Clone the [Git Repository](https://github.com/emonney/QuickApp.git) and edit with your favorite editor. e.g. Visual Studio, Visual Studio Code
*   Install Project template from the [Visual Studio Gallery](https://marketplace.visualstudio.com/items?itemName=adentum.QuickApp-ASPNETCoreAngular2ProjectTemplate) and follow the usual File -> New Project -> Web -> QuickApp - to create a new Project from this template.
    Lunch with `F5` or `Ctrl+F5` (The usual way)
*   Yeoman generator package coming soon...


> **LOGIN WITH USERNAME OR EMAIL ADDRESS**
>> * **Default Administrator Account**
>>   * Username: admin
>>   * Email:    admin@ebenmonney.com
>>   * Password: tempP@ss123
>> * **Default Standard Account**
>>   * Username: user
>>   * Email:    user@ebenmonney.com
>>   * Password: tempP@ss123




**NOTE** For faster builds you can comment out the line `"postcompile": [ "node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js" ]` in the "`project.json`" file.
 This is only required for the first time build and when the vendor packages in the `webpack.config.vendor.js` file is modified.

## Documentation

*   [Overview of QuickApp](http://ebenmonney.com/quickapp)
*   [Conceptual overview of what is ASP.NET Core](https://go.microsoft.com/fwlink/?LinkId=518008)
*   [Angular2 documentation overview](http://angular.io/docs/ts/latest/guide)
*   [Working with Data](https://go.microsoft.com/fwlink/?LinkId=398602)
*   [An introduction to webpack](https://webpack.js.org/guides/get-started/)


## License

Released under the [MIT License](https://github.com/emonney/QuickApp/blob/master/LICENSE).


I would love to hear your [feedback](mailto:info@ebenmonney.com)
