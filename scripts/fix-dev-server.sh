user=$(grep 'Path' ~/.mozilla/firefox/profiles.ini | sed 's/Path=//g')

userChromeCSSPath=~/.mozilla/firefox/$user/chrome/userChrome.css

rm -rf "$userChromeCSSPath"
