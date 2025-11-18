using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace RealtimeService.Hubs
{
    public class DashboardHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            return base.OnConnectedAsync();
        }

        // ตัวอย่าง broadcast ง่าย ๆ
        public async Task SendTestMessage(string message)
        {
            await Clients.All.SendAsync("TestMessage", message);
        }
    }
}