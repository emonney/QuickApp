// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using QuickApp.ViewModels;
using System;
using System.Linq;

namespace QuickApp.Helpers
{
    public static class Extensions
    {
        // HttpResponse
        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(new PageHeader(currentPage, itemsPerPage, totalItems, totalPages)));
            response.Headers.Add("access-control-expose-headers", "Pagination"); // CORS
        }

        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("access-control-expose-headers", "Application-Error");// CORS
        }

        // string
        public static string NullIfWhiteSpace(this string value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value;
        }

        // Array
        public static T[] NullIfEmpty<T>(this T[] value)
        {
            return value?.Any() == true ? value : null;
        }
    }
}
