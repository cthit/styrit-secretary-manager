import json
import threading

import mail_handler
import setup
import web_handler

if __name__ == '__main__':
    setup.load_general_config()
    setup.load_meeting_config()

    threading.Thread(target=web_handler.host).start()
    mail_handler.send_mails()