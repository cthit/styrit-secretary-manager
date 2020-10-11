from HttpResponse import HttpResponse, get_with_data, get_with_error
from command.MeetingCommands import update_meeting_check_for_deadline
from validation.Validation import validate_meeting_id_from_str


def handle_start_timer(id: str) -> HttpResponse:
    meeting_id_res = validate_meeting_id_from_str(id)
    if meeting_id_res.is_error:
        return get_with_error(meeting_id_res.message)
    print("Starting deadline check for meeting {0}".format(id))
    update_meeting_check_for_deadline(meeting_id_res.data, True)
    return get_with_data({})
