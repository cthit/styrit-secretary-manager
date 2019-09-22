from pony import orm
from pony.orm import db_session

import setup

# @db_session
# def get_tasks_for(group):
#     gt_names = list(orm.select(gtg.name.name for gtg in GroupsTasksGroup if gtg.group.name == group))
#     tasks = []
#     for name in gt_names:
#         for name, d_name in list(orm.select((gtt.task.name, gtt.task.display_name) for gtt in GroupsTasksTask if gtt.name.name == name)):
#             tasks.append({"codeName": name, "displayName": d_name})
#
#     return tasks


if __name__ == '__main__':
    setup.load_general_config()
    setup.load_meeting_config()
    # Generate the code-objects
    setup.generate_codes()

    #get_tasks_for("sexit")