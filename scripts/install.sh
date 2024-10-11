#!/bin/bash
echo "Available profiles:"

profiles=($(grep 'Name=' ~/.mozilla/firefox/profiles.ini | sed 's/Name=//g'))

for i in "${!profiles[@]}"; do
    echo "$(($i + 1))=${profiles[$i]}"
done

echo "Specify which profile you want the theme to apply to (enter the number):" 
read choice

selected_profile=${profiles[$((choice - 1))]}

echo "You selected: $selected_profile"
user=$(grep --max-count 1 "Path=.*$selected_profile" ~/.mozilla/firefox/profiles.ini | sed 's/Path=//g')

echo "Profile path: $user"

userSettings=~/.mozilla/firefox/$user/user.js
userChromeCSSPath=~/.mozilla/firefox/$user/chrome/userChrome.css

mkdir -p "$HOME/.mozilla/firefox/$user/chrome"
touch "$userChromeCSSPath"

curl -L https://github.com/dxdotdev/arc-ui-theme/releases/latest/download/userChrome.css >"$userChromeCSSPath"

if [ ! -e "$userSettings" ] || (! grep 'toolkit.legacyUserProfileCustomizations.stylesheets' "$userSettings"); then
	echo 'user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);' >>"$userSettings"
fi

echo "userChrome.css installed!"

