// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using MailKit.Net.Smtp;
using MimeKit;
using System;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using Microsoft.Extensions.Options;

namespace QuickApp.Helpers
{
    public interface IEmailSender
    {
        Task<(bool success, string errorMsg)> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recepients, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<(bool success, string errorMsg)> SendEmailAsync(string recepientName, string recepientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<(bool success, string errorMsg)> SendEmailAsync(string senderName, string senderEmail, string recepientName, string recepientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    }



    public class EmailSender : IEmailSender
    {
        private SmtpConfig _config;


        public EmailSender(IOptions<SmtpConfig> config)
        {
            _config = config.Value;
        }


        public async Task<(bool success, string errorMsg)> SendEmailAsync(
            string recepientName,
            string recepientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(_config.Name, _config.EmailAddress);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }



        public async Task<(bool success, string errorMsg)> SendEmailAsync(
            string senderName,
            string senderEmail,
            string recepientName,
            string recepientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }



        public async Task<(bool success, string errorMsg)> SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recepients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recepients);
            message.Subject = subject;
            message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

            try
            {
                if (config == null)
                    config = _config;

                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                Utilities.CreateLogger<EmailSender>().LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
                return (false, ex.Message);
            }
        }
    }



    public class SmtpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }

        public string Name { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}
