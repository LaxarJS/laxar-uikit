# Global compass configuration for the default.theme
# -----
require 'autoprefixer-rails'

# Added post-compile hook for autorpefxier
# ----------------------------------------

# Set support to specific browsers: ['ie 8', 'ie 7']
# Set support to only browsers that have certain market share: ['> 5%']
# Set support to the last n versions of browsers: ['latest 2 versions']

# > n% is browser versions, selected by global usage statistics.
# ff > 20 and ff >= 20 is Firefox versions newer, that 20.
# none don’t set any browsers to clean CSS from any vendor prefixes.

# android for old Android stock browser.
# bb for Blackberry browser.
# chrome for Google Chrome.
# ff for Mozilla Firefox.
# ie for Internet Explorer.
# ios for iOS Safari.
# opera for Opera.
# safari for desktop Safari.

browsers = ["ff >= 10", "chrome >= 10", "ie >= 8"]

on_stylesheet_saved do |file|
   css = File.read(file)
   File.open(file, 'w') { |io| io << AutoprefixerRails.compile(css, browsers) }
end


# Variable
base_dir = File.dirname(__FILE__) + '/..'
# Find SCSS in theme (from widgets, controls and layouts)
add_import_path base_dir + '/scss/'
# Find UIKit SCSS
add_import_path base_dir + '/../../scss/'
# Find Third party SCSS
# - Bootstrap
add_import_path base_dir + '/../../bower_components/bootstrap-sass-official/vendor/assets/stylesheets/'
# - Font Awesome (use bower_components directory so that imports have a prefix)
add_import_path base_dir + '/../../bower_components/'



# Sass/Scss Directory
sass_dir = "scss"

# Image Directory For Sprites
sprite_load_path = ["."]


# Output
# ------

css_dir = "css"
images_dir = "images"
fonts_dir = "fonts"


# Indicates whether the compass helper functions should generate relative urls from the generated css to assets, or absolute urls using the http path for that asset type.
relative_assets = true

# CSS Output Style
# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :expanded

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false
