"""App package init.

Allow ``*.local`` addresses through ``EmailStr`` validation. The default
development accounts use ``@ecokitchen.local`` (see ``app/db/seed.py`` /
``credentials.md``); ``email-validator`` otherwise rejects the reserved
``.local`` TLD before the request reaches a route handler.
"""

import email_validator

if "local" in email_validator.SPECIAL_USE_DOMAIN_NAMES:
    email_validator.SPECIAL_USE_DOMAIN_NAMES.remove("local")
