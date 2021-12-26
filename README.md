<h1 align="center">
  <img src="/logo.jpg" alt="Ethereal Y" width="192" height="192"/><br>
  Ethereal Y
</h1>

[![Visits Badge](https://badges.pufler.dev/visits/exposedcat/ethereal-y)](https://github.com/ExposedCat)
[![](https://img.shields.io/badge/Telegram-Ethereal%20Y-informational?style=flat&logo=telegram&logoColor=26A5E4&color=26A5E4)](https://t.me/ethereal-y) 
[![](https://img.shields.io/badge/Telegram-Developer-informational?style=flat&logo=telegram&logoColor=26A5E4&color=gold)](https://t.me/ExposedCatDev)

## ⭐️ Features
`[expression]` - Replace with specified expression without square brackets.  
`{Reply}` - Requires reply message. 
### Roleplay
Sends roleplay message with specified action.  
```
/do [action]
```
### RegExp Replacement
Sends message with specified replacements.  
```
/re [flags1]/[expression1]/[replacement1]
...
[flagsN]/[expressionN]/[replacementN]
```
`flags` can be omitted.
### Reminders
Sends specified note at specified date and time with tagging all subsribers.
```
/reminder 31.01 12:34 Note
/reminder today 12:34 Note
/reminder tomorrow 12:34 Note
```
### Broadcast
`{Reply}` `{Full rights}`  
Sends specified message to all groups to which this bot was added.
```
/broadcast
```
### Recurring reminders
Sends specified note every time by specified [time rule](https://crontab.guru) with tagging all subsribers.
```
/cron 30 */1 * * * Note
```
### Triggers
Sends specified message when specified keyword is sent.
#### Add
`{Reply}`
```
/bind [keyword]
```
#### Remove
```
/unbind [keyword]
```
#### Show group triggers
```
/bindings
```
### Restrictions
`{Admin rights}`  
Restricts specified user.
#### Read-only mode (mute)
`{Reply}`
```
/mute
/mute [time in minutes]
```
#### Remove all restrictions
`{Reply}`
```
/unmute
```
#### Kick user (ban)
`{Reply}`
```
/ban
```
## 🏗️ Forking
```
git clone https://github.com/ExposedCat/ethereal-y.git
cd ethereal-y
rm -r .git
npm install
```
Set `TOKEN` environment variable and run bot with `npm start`
