using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hardware.Info;
using System.Diagnostics;

namespace be.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HienThiController : ControllerBase
    {
        private readonly HardwareInfo _hardwareInfo;
        private readonly PerformanceCounter _cpuCounter;

        public HienThiController()
        {
            _hardwareInfo = new HardwareInfo();
            _hardwareInfo.RefreshAll();
            _cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemInfo()
        {
            var ram = _hardwareInfo.MemoryStatus;
            var cpu = _hardwareInfo.CpuList.FirstOrDefault();
            
            // Lấy CPU usage
            var cpuUsage = GetCpuUsage();
            
            var drives = DriveInfo.GetDrives()
                .Where(d => d.IsReady)
                .Select(d => new
                {
                    Name = d.Name,
                    Total = d.TotalSize,
                    Used = d.TotalSize - d.TotalFreeSpace,
                    Free = d.TotalFreeSpace
                }).ToList();

            return Ok(new
            {
                RAM = new
                {
                    Total = ram.TotalPhysical,
                    Used = ram.TotalPhysical - ram.AvailablePhysical,
                    Free = ram.AvailablePhysical
                },
                CPU = new
                {
                    Name = cpu?.Name,
                    LogicalCores = cpu?.NumberOfLogicalProcessors,
                    UsagePercentage = Math.Round(cpuUsage, 2)
                },
                Disks = drives
            });
        }

        private float GetCpuUsage()
        {
            try
            {
                // Đọc lần đầu tiên (cần thiết cho PerformanceCounter)
                _cpuCounter.NextValue();
                
                // Đợi một chút rồi đọc lại để có giá trị chính xác
                System.Threading.Thread.Sleep(10);
                
                return _cpuCounter.NextValue();
            }
            catch
            {
                return 0;
            }
        }

        protected  void Dispose(bool disposing)
        {
            if (disposing)
            {
                _cpuCounter?.Dispose();
            }
          
        }
    }
}