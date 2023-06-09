// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;

namespace QuickApp.Helpers
{
    public static class EmailTemplates
    {
        private static IWebHostEnvironment _hostingEnvironment;
        private static string testEmailTemplate;
        private static string plainTextTestEmailTemplate;

        public static void Initialize(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public static string GetTestEmail(string recipientName, DateTime testDate)
        {
            testEmailTemplate ??= ReadPhysicalFile("Helpers/Templates/TestEmail.template");

            var emailMessage = testEmailTemplate
                .Replace("{user}", recipientName)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }

        public static string GetPlainTextTestEmail(DateTime date)
        {
            plainTextTestEmailTemplate ??= ReadPhysicalFile("Helpers/Templates/PlainTextTestEmail.template");

            var emailMessage = plainTextTestEmailTemplate
                .Replace("{date}", date.ToString());

            return emailMessage;
        }

        private static string ReadPhysicalFile(string path)
        {
            if (_hostingEnvironment == null)
                throw new InvalidOperationException($"{nameof(EmailTemplates)} is not initialized");

            var fileInfo = _hostingEnvironment.ContentRootFileProvider.GetFileInfo(path);

            if (!fileInfo.Exists)
                throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            using (var fs = fileInfo.CreateReadStream())
            {
                using (var sr = new StreamReader(fs))
                {
                    return sr.ReadToEnd();
                }
            }
        }
    }
}
