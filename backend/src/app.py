import threading

import end_date_handler
import mail_handler
import setup
import web_handler

if __name__ == '__main__':
    setup.load_general_config()
    setup.load_meeting_config()

    threading.Thread(target=web_handler.host).start()
    threading.Thread(target=mail_handler.send_mails).start()
    threading.Thread(target=end_date_handler.check_for_enddate).start()