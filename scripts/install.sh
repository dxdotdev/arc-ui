user=$(grep 'Path' ~/.mozilla/firefox/profiles.ini | sed 's/Path=//g')

userPreferences=~/.mozilla/firefox/$user/prefs.js
userChromeCSSPath=~/.mozilla/firefox/$user/chrome/userChrome.css

curl -L https://github.com/dxdotdev/arc-ui-theme/releases/latest/download/userChrome.css >"$userChromeCSSPath"

if (! grep 'toolkit.legacyUserProfileCustomizations.stylesheets' "$userPreferences"); then
	echo 'user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);' >>"$userPreferences"
fi
