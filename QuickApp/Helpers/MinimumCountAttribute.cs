// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace QuickApp.Helpers
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class MinimumCountAttribute : ValidationAttribute
    {
        private readonly int _minCount;
        private readonly bool _allowEmptyStringValues;
        private readonly bool _required;
        private const string _defaultError = "'{0}' must have at least {1} item.";

        public MinimumCountAttribute() : this(1)
        {

        }

        public MinimumCountAttribute(int minCount, bool required = true, bool allowEmptyStringValues = false) : base(_defaultError)
        {
            _minCount = minCount;
            _required = required;
            _allowEmptyStringValues = allowEmptyStringValues;
        }

        public override bool IsValid(object value)
        {
            if (value == null)
                return !_required;

            if (!_allowEmptyStringValues && value is ICollection<string> stringList)
                return stringList.Count(s => !string.IsNullOrWhiteSpace(s)) >= _minCount;

            if (value is ICollection list)
                return list.Count >= _minCount;

            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return string.Format(ErrorMessageString, name, _minCount);
        }
    }
}
