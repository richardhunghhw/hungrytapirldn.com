#/bin/bash

# Setup secrets from OP
op inject -i .devcontainer/local/devcontainer.env.tpl -o .devcontainer/local/devcontainer.env --force
op inject -i .env.tpl -o .env --force
op inject -i .dev.vars.tpl -o .dev.vars --force
op inject -i workers/store-config/.dev.vars.tpl -o workers/store-config/.dev.vars --force
op inject -i workers/conversion-dispatcher/.dev.vars.tpl -o workers/conversion-dispatcher/.dev.vars --force

exit 0