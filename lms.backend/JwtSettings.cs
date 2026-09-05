namespace lms.backend;

/// <summary>การตั้งค่า JWT อ่านจาก appsettings.json หัวข้อ "Jwt"</summary>
public class JwtSettings
{
    public const string SectionName = "Jwt";
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpireMinutes { get; set; } = 480;
}
