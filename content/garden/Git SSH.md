# Git SSH

Really useful if you're using two or more [[Git]] accounts on a single computer. On windows I initially used the GitHub CLI tool, which allowed the use of `gh auth login` but this got annoying due to 2FA.

Switching to SSH made this process **much** easier, and it's relatively simple to get it set up.

#### Note
This will give you the correct permissions when pushing / pulling from a repo, but it will still use your global git config. Make sure to set `git config --local user.name` and `git config --local user.email` for each repository.

Alternatively, see [[Git Account Switch]].

## Setup

First you'll need to add some files in  `~/.ssh` if they don't exist already:

```bash
touch ~/.ssh/config && touch .bash_profile && touch .bashrc
```

## SSH Keys
Follow the steps in the section named "Generating a new SSH Key" found in the following documentation from GitHub: _[Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-windows)_

## Configure SSH
Add your accounts using a unique hostname. Set `IdentityFile` to the name of the key you created for each account in the previous step.

```text
# ~/.ssh/config

# personal github account
Host github.com
  HostName github.com
  IdentityFile ~/.ssh/id_personal
  IdentitiesOnly yes
  
# work github account
Host github-work
  HostName github.com
  IdentityFile ~/.ssh/id_work
  IdentitiesOnly yes
```

## Usage
When cloning a repository, you can use each hostname depending on which account you'd like to use. For example your personal account:

```bash
git clone git@github.com:Username/repo.git
```

And for your work account:

```bash
git clone git@github-work:Username/repo.git
```

If you have an existing repository and want to update it to use SSH to avoid permission issues (assuming remote is `origin`):

```bash
git remove -v
git remote set-url origin git@github.com:Username/repo.git
```

Replacing `@github.com` with whatever hostname you'd like to use.

## Auto Startup
This works great, but if you're running `git` commands from the command line you'll end up typing in your password a lot.

### Bash
First, ensure that following lines are added to `.bash_profile`:

```bash
test -f ~/.profile && . ~/.profile
test -f ~/.bashrc && . ~/.bashrc
```

Now, add the following text to `.bashrc`, which should be found in your root user home folder:

```bash
# Start SSH Agent
#----------------------------

SSH_ENV="$HOME/.ssh/environment"

function run_ssh_env {
  . "${SSH_ENV}" > /dev/null
}

function start_ssh_agent {
  echo "Initializing new SSH agent..."
  ssh-agent | sed 's/^echo/#echo/' > "${SSH_ENV}"
  echo "succeeded"
  chmod 600 "${SSH_ENV}"

  run_ssh_env;

  # add your SSH keys here
  ssh-add ~/.ssh/id_rsa;
}

if [ -f "${SSH_ENV}" ]; then
  run_ssh_env;
  ps -ef | grep ${SSH_AGENT_PID} | grep ssh-agent$ > /dev/null || {
    start_ssh_agent;
  }
else
  start_ssh_agent;
fi
```

### Windows
By default the `sshd` service is set to start manually. To start it each time the server is rebooted, run the following commands from an elevated PowerShell prompt:

```powershell
# By default the ssh-agent service is disabled. Allow it to be manually started for the next step to work.
# Make sure you're running as an Administrator.
Get-Service ssh-agent | Set-Service -StartupType Manual

# Start the service
Start-Service ssh-agent

# This should return a status of Running
Get-Service ssh-agent

# Now load your key files into ssh-agent
ssh-add ~\.ssh\id_personal
ssh-add ~\.ssh\id_work
```

If you're having problems getting the service running:

```powershell
# check if the service is running
Get-Service ssh-agent

# check if it has been disabled
Get-Service ssh-agent | Select StartType

# if it is then set start type to manual
Get-Service ssh-agent -Name ssh-agent | Set-Service -StartupType Manual

# start the service 
Start-Service ssh-agent

# optionally set it back to automatic
Get-Service ssh-agent -Name ssh-agent | Set-Service -StartupType Automatic
```