from os import environ

import requests

from data_objects.MailData import MailData
from queries.ConfigQueries import get_config_value


def send_email(email_data: MailData) -> bool:
    gotify_auth_key = environ.get("gotify_auth_key", "123abc")
    auth = "pre-shared: " + str(gotify_auth_key)
    url = get_config_value("gotify_url")
    header = {"Authorization": auth, "Accept": "*/*"}
    mail_from = get_config_value("from_email_address")
    data = {"to": email_data.mail_to,
            "from": mail_from,
            "subject": email_data.subject,
            "body": email_data.msg}
    try:
        r = requests.post(url=url, json=data, headers=header)
        print("Sent email to {0}, status code {1}, reason {2}".format(email_data.mail_to, r.status_code, r.reason))
        return True
    except Exception as e:
        print(f"Encountered an error while contacting gotify: {e}")
        return False
