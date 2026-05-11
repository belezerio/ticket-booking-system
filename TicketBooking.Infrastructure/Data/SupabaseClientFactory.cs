namespace TicketBooking.Infrastructure.Data;

public class SupabaseClientFactory
{
    private readonly string _url;
    private readonly string _key;
    private Supabase.Client? _client;

    public SupabaseClientFactory(string url, string key)
    {
        _url = url;
        _key = key;
    }

    public async Task<Supabase.Client> GetClientAsync()
    {
        if (_client != null) return _client;

        var options = new Supabase.SupabaseOptions
        {
            AutoConnectRealtime = false
        };

        _client = new Supabase.Client(_url, _key, options);
        await _client.InitializeAsync();
        return _client;
    }
}