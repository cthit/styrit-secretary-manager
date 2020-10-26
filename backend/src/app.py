import threading

import setup
import web_handler
from process import EndDateProcess

if __name__ == '__main__':
    setup.setup_db()

    threading.Thread(target=EndDateProcess.check_for_enddate).start()
    threading.Thread(target=web_handler.host).start()
