import threading

import setup
import web_handler

from src import end_date_handler

if __name__ == '__main__':
    setup.setup_db()
    threading.Thread(target=end_date_handler.check_for_enddate).start()
    threading.Thread(target=web_handler.host).start()
