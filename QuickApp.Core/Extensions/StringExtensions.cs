// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------
using System;
using System.Linq;

namespace QuickApp.Core.Extensions
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
