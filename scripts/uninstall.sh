#!/usr/bin/env bash
profiles=$(grep 'Name=' ~/.mozilla/firefox/profiles.ini | sed 's/Name=//g')

for i in "${!profiles[@]}"; do
	user=$(grep --max-count 1 "Path=.*${profiles[$i]}" ~/.mozilla/firefox/profiles.ini | sed 's/Path=//g')
	userSettings=~/.mozilla/firefox/$user/user.js
	userChromeCSSPath=~/.mozilla/firefox/$user/chrome/userChrome.css

	rm -f "$userSettings" "$userChromeCSSPath"
done

echo "userChrome.css uninstalled!"
