using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using lms.backend.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace lms.backend.Services;

public class TokenService(IOptions<JwtSettings> options)
{
    private readonly JwtSettings _settings = options.Value;

    public (string Token, DateTime ExpiresAt) CreateToken(AppUser user)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(_settings.ExpireMinutes);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.Username),
            new(ClaimTypes.Role, user.Role)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
