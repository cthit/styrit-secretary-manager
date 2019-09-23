from pony import orm
from pony.orm import db_session

import setup
import web_handler

if __name__ == '__main__':
    setup.load_general_config()
    setup.load_meeting_config()
    web_handler.host()