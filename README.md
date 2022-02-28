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
/reminder [date] [time] [note]
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
### Vote for restriction
`{Reply}` 
Creates poll to mute (Read-Only mode) or kick chat member. Restriction is applied after positive votes of 30% of group members.
```
/voteban
/votemute
```
### Send anonymous message
Sends given text message and deletes sender.
```
/anon [text]
```
### Recurring reminders
Sends specified note every time by specified [time rule](https://crontab.guru) with tagging all subsribers.
```
/cron [time rule] [note]
/cron 30 */1 * * * Note
```
### Triggers
Sends specified message when specified keyword is sent (or deletes trigger).
#### Add
`{Reply}`  
`-r` use regular expression as trigger
`-s` makes trigger case-sensitive. Removes `i` flag if `-r` is specified
```
/bind [keyword]
/bind -s [keyword]
/bind -r [keyword]
/bind -r -s [keyword]
```
#### Add trigger to delete
`{Reply}`
`-s` makes trigger case-sensitive
```
/bind_delete [keyword]
/bind_delete -s [keyword]
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
Restricts specified user.
#### Read-only mode (mute)
`{Reply}` `{Admin rights}`  
```
/mute
/mute [time in minutes]
```
#### Remove all restrictions
`{Reply}` `{Admin rights}`  
```
/unmute
```
#### Kick user (ban)
`{Reply}` `{Admin rights}`  
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
