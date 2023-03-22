// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using IdentityModel;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QuickApp.Helpers
{
    public static class Utilities
    {
        public static void QuickLog(string text, string logPath)
        {
            string dirPath = Path.GetDirectoryName(logPath);

            if (!Directory.Exists(dirPath))
                Directory.CreateDirectory(dirPath);

            using (StreamWriter writer = File.AppendText(logPath))
            {
                writer.WriteLine($"{DateTime.Now} - {text}");
            }
        }



        public static string GetUserId(ClaimsPrincipal user)
        {
            return user.FindFirstValue(JwtClaimTypes.Subject)?.Trim();
        }



        public static string[] GetRoles(ClaimsPrincipal identity)
        {
            return identity.Claims
                .Where(c => c.Type == JwtClaimTypes.Role)
                .Select(c => c.Value)
                .ToArray();
        }
    }
}
