namespace DAL.Core.Permissions
{
  public class ApplicationPermission
  {
    public ApplicationPermission()
    { }

    public ApplicationPermission(
      string name, string type, string scope, string action, string groupName, string description)
    {
      Name = name;
      Value = string.Join(".", new string[] { type, scope, action });
      Type = type;
      Scope = scope;
      Action = action;
      GroupName = groupName;
      Description = description;
    }

    public string Name { get; set; }

    /// <summary>
    /// Dot-separated Type.Scope.Action
    /// </summary>
    /// <remarks>
    /// This property is related to Type, Scope & Action 
    /// properties and must not be modified separately
    /// </remarks>
    public string Value { get; set; }

    public string GroupName { get; set; }

    public string Description { get; set; }

    /// <summary>
    /// </summary>
    /// <remarks>
    /// This property is related to 'value',
    /// and must not be modified separately
    /// </remarks>
    public string Type { get; set; }

    /// <summary>
    /// </summary>
    /// <remarks>
    /// This property is related to 'value',
    /// and must not be modified separately
    /// </remarks>
    public string Scope { get; set; }

    /// <summary>
    /// </summary>
    /// <remarks>
    /// This property is related to 'value',
    /// and must not be modified separately
    /// </remarks>
    public string Action { get; set; }

    public override string ToString()
    {
      return Value;
    }

    public static implicit operator string(ApplicationPermission permission)
    {
      return permission.Value;
    }
  }
}
