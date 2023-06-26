#/bin/bash

# Setup secrets from OP
op inject -i .env.tpl -o .env --force
op inject -i .dev.vars.tpl -o .dev.vars --force

exit 0