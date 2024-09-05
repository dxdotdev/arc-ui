user=$(grep 'Path' ~/.mozilla/firefox/profiles.ini | sed 's/Path=//g')

userSettings=~/.mozilla/firefox/$user/user.js
userChromeCSSPath=~/.mozilla/firefox/$user/chrome/userChrome.css

mkdir -p "$HOME/.mozilla/firefox/$user/chrome"
touch "$userChromeCSSPath"

curl -L https://github.com/dxdotdev/arc-ui-theme/releases/latest/download/userChrome.css >"$userChromeCSSPath"

if [ ! -e "$userSettings" ] || (! grep 'toolkit.legacyUserProfileCustomizations.stylesheets' "$userSettings"); then
	echo 'user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);' >>"$userSettings"
fi

echo "userChrome.css installed!"
