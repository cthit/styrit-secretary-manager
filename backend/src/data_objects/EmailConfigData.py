from dataclasses import dataclass

import pytz


@dataclass
class EmailConfigData:
    timezone = pytz.timezone(pytz.country_timezones["SE"][0])
    active_msg: str
    stories_msg: str
    active_subject: str
    stories_subject: str
    frontend_url: str
    document_template_url: str
    secretary_email: str
    board_display_name: str
    board_email: str
    email_domain: str
