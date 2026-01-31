# PowerShell script to enable mDNS on Windows 11
# Requires administrator privileges

# Check if running as administrator
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Please run this script as an administrator."
    exit
}

# Enable mDNS in DNS Client service
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" -Name "EnableMDNS" -Value 1 -Type DWord -Force

# Try to restart DNS Client service to apply changes
try {
    Restart-Service -Name Dnscache -Force
    Write-Host "DNS Client service restarted successfully."
} catch {
    Write-Host "Failed to restart DNS Client service. Please restart your computer manually."
}

# Enable firewall rules for mDNS (UDP port 5353)
try {
    New-NetFirewallRule -DisplayName "mDNS Inbound" -Direction Inbound -Protocol UDP -LocalPort 5353 -Action Allow -Profile Any -ErrorAction Stop
    Write-Host "Inbound firewall rule for mDNS added."
} catch {
    Write-Host "Inbound firewall rule for mDNS may already exist or failed to add."
}

try {
    New-NetFirewallRule -DisplayName "mDNS Outbound" -Direction Outbound -Protocol UDP -LocalPort 5353 -Action Allow -Profile Any -ErrorAction Stop
    Write-Host "Outbound firewall rule for mDNS added."
} catch {
    Write-Host "Outbound firewall rule for mDNS may already exist or failed to add."
}

Write-Host "mDNS has been enabled. You may need to restart your computer for changes to take full effect."