# Install and remove the theme in the ulauncher user themes directory.
.PHONY = intall remove

THEME_NAME = dark-trooper

install:
	@mkdir -p ~/.config/ulauncher/user-themes/$(THEME_NAME)
	@cp src/theme/* ~/.config/ulauncher/user-themes/$(THEME_NAME)

remove:
	@rm -rf ~/.config/ulauncher/user-themes/$(THEME_NAME)