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
        // string
        public static string NullIfWhiteSpace(this string value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value;
        }

        // Array
        public static T[] NullIfEmpty<T>(this T[] value)
        {
            return value?.Length == 0 ? null : value;
        }
    }
}
