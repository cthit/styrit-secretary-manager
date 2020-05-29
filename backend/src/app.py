import threading

import setup
import web_handler

import end_date_handler

from src.db_migration_tool import backup_db

if __name__ == '__main__':
    setup.setup_db()
#    backup_db()
    restore_db()
    threading.Thread(target=end_date_handler.check_for_enddate).start()
    threading.Thread(target=web_handler.host).start()
