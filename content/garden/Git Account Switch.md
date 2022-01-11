# Git Account Switch
A simple PowerShell application to switch git accounts. Add somewhere and add it to your path.

## Usage
```powershell
# personal account globally
gitSwitch -Scope Global -Account Personal

# work account globally
gitSwitch -Scope Global -Account Work

# personal account locally
gitSwitch -Scope Local -Account Personal

# work account locally
gitSwitch -Scope Local -Account Work
```

## Code
```powershell
# gitswitch.ps

param(
  [Parameter(Mandatory=$true)]
  [ValidateSet('Global','Local')]
  [String]$Scope,
 
  [Parameter(Mandatory=$true)]
  [ValidateSet('Work','Personal')]
  [String]$Account
)

$GitScope = if ($Scope -eq 'Global') { '--global' } else { '--local' }

$PersonalAccount = [PSCustomObject]@{
  Name = 'Personal Name';
  Email = 'personal@me.com'
}

$WorkAccount = [PSCustomObject]@{
  Name = 'Work name';
  Email = 'work@worky.com'
}

$GitAccount = if ($Account -eq 'Work') { $WorkAccount} else { $PersonalAccount }


git config $gitScope user.name $GitAccount.Name
git config $gitScope user.email $GitAccount.Email

if (-not $LASTEXITCODE) 
{
  Write-Host "Scope:"$Scope
  Write-Host "Name:"$GitAccount.Name 
  Write-Host "Email:"$GitAccount.Email 
}

```