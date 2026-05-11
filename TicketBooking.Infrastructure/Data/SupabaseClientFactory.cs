namespace TicketBooking.Infrastructure.Data;

public class SupabaseClientFactory
{
    private readonly string _url;
    private readonly string _anonKey;
    private readonly string _serviceKey;
    private Supabase.Client? _authClient;
    private Supabase.Client? _serviceClient;

    public SupabaseClientFactory(string url, string anonKey, string serviceKey)
    {
        _url = url;
        _anonKey = anonKey;
        _serviceKey = serviceKey;
    }

    // Use this for Auth operations (register, login)
    public async Task<Supabase.Client> GetAuthClientAsync()
    {
        if (_authClient != null) return _authClient;
        var options = new Supabase.SupabaseOptions { AutoConnectRealtime = false };
        _authClient = new Supabase.Client(_url, _anonKey, options);
        await _authClient.InitializeAsync();
        return _authClient;
    }

    // Use this for database operations (CRUD)
    public async Task<Supabase.Client> GetClientAsync()
    {
        if (_serviceClient != null) return _serviceClient;
        var options = new Supabase.SupabaseOptions { AutoConnectRealtime = false };
        _serviceClient = new Supabase.Client(_url, _serviceKey, options);
        await _serviceClient.InitializeAsync();
        return _serviceClient;
    }
}