#/bin/bash

# Setup secrets from OP
op inject -i .devcontainer/local/devcontainer.env.tpl -o .devcontainer/local/devcontainer.env --force
op inject -i .env.tpl -o .env --force
op inject -i .dev.vars.tpl -o .dev.vars --force

exit 0