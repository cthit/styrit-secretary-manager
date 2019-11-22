import threading

import setup
import web_handler
import datetime

if __name__ == '__main__':
    setup.setup_db()

    threading.Thread(target=web_handler.host).start()
