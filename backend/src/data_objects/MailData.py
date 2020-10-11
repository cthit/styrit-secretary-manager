from dataclasses import dataclass


@dataclass
class MailData:
    mail_to: str
    subject: str
    msg: str
