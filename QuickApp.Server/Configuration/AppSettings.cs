// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

namespace QuickApp.Server.Configuration
{
    public class AppSettings
    {
        public SmtpConfig? SmtpConfig { get; set; }
    }

    public class SmtpConfig
    {
        public required string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }

        public required string EmailAddress { get; set; }
        public string? Name { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
