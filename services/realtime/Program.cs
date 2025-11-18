using Hangfire;
using Hangfire.Redis.StackExchange;
using RealtimeService.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Hangfire + Redis config (ทีหลังค่อยย้าย connection string ไป appsettings)
var redisConnection = builder.Configuration.GetConnectionString("Redis")
                     ?? "localhost:6379";

// Add abortconnect=false to allow retries if redis is not immediately available
// StackExchange.Redis use comma separated format: host:port, options=value
if (!redisConnection.Contains("abortConnect"))
{
    redisConnection = $"{redisConnection},abortConnect=false";
}

builder.Services.AddHangfire(config =>
{
    config.UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UseRedisStorage(redisConnection);
});

builder.Services.AddHangfireServer();

// SignalR
builder.Services.AddSignalR();

// basic CORS (ไว้ให้ Next.js ต่อ)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true); // TODO: จำกัด origin ทีหลัง
    });
});

var app = builder.Build();

app.UseCors();

// Hangfire dashboard (dev only)
app.UseHangfireDashboard("/hangfire");

// minimal health check
app.MapGet("/", () => "RealtimeService is running");

// SignalR hub
app.MapHub<DashboardHub>("/hubs/dashboard");

// ตัวอย่าง job ง่าย ๆ
BackgroundJob.Enqueue(() => Console.WriteLine("RealtimeService started at " + DateTime.UtcNow));

app.Run();