# Set default SCSS file encoding to override system default
Encoding.default_external = "utf-8"

# Global compass configuration for the default.theme
# -----
require 'autoprefixer-rails'

# Sets the number of digits of precision
# For example, if this is 3,
# 3.1415926 will be printed as 3.142
# Bootstrap needs a precision of ten!
Sass::Script::Number.precision=10

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

options = { :browsers => ["ff >= 20", "chrome >= 20", "ie >= 9"] }

on_stylesheet_saved do |file|
   css = File.read(file)
   File.open(file, 'w') { |io| io << AutoprefixerRails.process(css, options) }
end



# Import Path
# -----------

def find_bower_dir( base_dir )
   relative_bower_dir = '../bower_components/'
   limit = 10
   until File.directory? (base_dir + relative_bower_dir)
      relative_bower_dir = '../' + relative_bower_dir
      limit -= 1
      if limit === 0 then abort( 'laxar-uikit default.theme: bower_components seems to be missing!' ) end
   end
   return File.expand_path( base_dir + relative_bower_dir ) + '/'
end

base_dir = File.dirname(__FILE__) + '/../'
bower_dir = find_bower_dir( base_dir )
puts 'laxar-uikit default.theme: using bower_components at ' + bower_dir

# Find SCSS in theme (from widgets, controls and layouts)
add_import_path base_dir + 'scss/'
# Find UIKit SCSS
add_import_path base_dir + '../../scss/'
# Find Third party SCSS
# - Bootstrap
add_import_path bower_dir + 'bootstrap-sass-official/assets/stylesheets/'
# - Font Awesome (use bower_components directory so that imports have a prefix)
add_import_path bower_dir



# Project directories
# -------------------

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
