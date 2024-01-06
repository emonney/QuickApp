// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using QuickApp.Core.Services;
using QuickApp.Server.Configuration;

namespace QuickApp.Server.Services.Email
{
    public class EmailSender(IOptions<AppSettings> config, ILogger<EmailSender> logger) : IEmailSender
    {
        private readonly SmtpConfig config = config.Value.SmtpConfig!;

        public async Task<(bool success, string? errorMsg)> SendEmailAsync(
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            bool isHtml = true)
        {
            var from = new MailboxAddress(config.Name, config.EmailAddress);
            var to = new MailboxAddress(recipientName, recipientEmail);

            return await SendEmailAsync(from, [to], subject, body, isHtml);
        }

        public async Task<(bool success, string? errorMsg)> SendEmailAsync(
            string senderName,
            string senderEmail,
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            bool isHtml = true)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recipientName, recipientEmail);

            return await SendEmailAsync(from, [to], subject, body, isHtml);
        }

        // For background tasks such as sending emails, its good practice to use job runners such
        // as hangfire https://www.hangfire.io or a service such as SendGrid https://sendgrid.com/
        public async Task<(bool success, string? errorMsg)> SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recipients,
            string subject,
            string body,
            bool isHtml = true)
        {
            var message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recipients);
            message.Subject = subject;
            message.Body = isHtml ?
                new BodyBuilder { HtmlBody = body }.ToMessageBody() :
                new TextPart("plain") { Text = body };

            try
            {
                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                    {
                        client.ServerCertificateValidationCallback =
                            (sender2, certificate, chain, sslPolicyErrors) => true;
                    }

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
                logger.LogError(ex, "An error occurred whilst sending email");
                return (false, ex.Message);
            }
        }
    }
}
