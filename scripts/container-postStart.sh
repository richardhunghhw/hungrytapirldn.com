#/bin/bash

# Setup secrets from OP
op inject -i .dev.vars.tpl -o .dev.vars

exit 0