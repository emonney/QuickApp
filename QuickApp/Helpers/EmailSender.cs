// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace QuickApp.Helpers
{
    public interface IEmailSender
    {
        Task<(bool success, string errorMsg)> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recipients, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<(bool success, string errorMsg)> SendEmailAsync(string recipientName, string recipientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
        Task<(bool success, string errorMsg)> SendEmailAsync(string senderName, string senderEmail, string recipientName, string recipientEmail, string subject, string body, SmtpConfig config = null, bool isHtml = true);
    }

    public class EmailSender : IEmailSender
    {
        private readonly SmtpConfig _config;
        private readonly ILogger _logger;

        public EmailSender(IOptions<AppSettings> config, ILogger<EmailSender> logger)
        {
            _config = config.Value.SmtpConfig;
            _logger = logger;
        }

        public async Task<(bool success, string errorMsg)> SendEmailAsync(
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(_config.Name, _config.EmailAddress);
            var to = new MailboxAddress(recipientName, recipientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }

        public async Task<(bool success, string errorMsg)> SendEmailAsync(
            string senderName,
            string senderEmail,
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recipientName, recipientEmail);

            return await SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }

        //For background tasks such as sending emails, its good practice to use job runners such as hangfire https://www.hangfire.io
        //or a service such as SendGrid https://sendgrid.com/
        public async Task<(bool success, string errorMsg)> SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recipients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recipients);
            message.Subject = subject;
            message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

            try
            {
                config ??= _config;

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
                _logger.LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
                return (false, ex.Message);
            }
        }
    }
}
