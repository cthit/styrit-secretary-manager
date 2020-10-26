import os
import shutil
from datetime import datetime
from uuid import UUID

from flask import send_file

from HttpResponse import HttpResponse, get_with_error, get_with_data, get_with_file
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.ArchiveCommands import create_archive_code, update_archive_location
from queries.ArchiveQueries import get_archive_data_by_code, get_archive_data_by_meeting_id
from queries.ConfigQueries import get_config_value
from queries.GroupMeetingFileQueries import get_file_paths
from queries.MeetingQueries import get_meeting_data_by_id
from validation.Validation import validate_code, validate_meeting_id_from_str


def download_archive(code_str: str) -> HttpResponse:
    code_res = validate_code(code_str)
    if code_res.is_error:
        return get_with_error(404, code_res.message)

    archive_data = get_archive_data_by_code(code_res.data)
    if archive_data is None:
        return get_with_error(400, "Archive not found")

    attachment_name = "documents_{meeting_no}_lp{lp}_{year}.zip".format(
        meeting_no=archive_data.meeting.meeting_no,
        lp=archive_data.meeting.lp,
        year=archive_data.meeting.year
    )
    file_path_name = os.path.normpath("{0}.zip".format(archive_data.archive_path))

    last_modified = datetime.now()
    cache_timeout = 60

    print("DOWNLOADING FILE: {file_path_name}".format(file_path_name=file_path_name))
    return get_with_file(send_file(
        file_path_name,
        as_attachment=True,
        attachment_filename=attachment_name,
        last_modified=last_modified,
        cache_timeout=cache_timeout
    ))


def get_archive_url(id_str: str) -> HttpResponse:
    id_res = validate_meeting_id_from_str(id_str)
    if id_res.is_error:
        return get_with_error(400, id_res.message)
    id = id_res.data

    archive_code_res = create_archive(id)
    if archive_code_res.is_error:
        return get_with_error(500, archive_code_res.message)
    archive_code = archive_code_res.data

    base_url = get_config_value("archive_base_url")
    redirect_url = f"{base_url}/{archive_code}"
    print("Should be redirected to {0}".format(redirect_url))
    return get_with_data({
        "redirect_url": redirect_url
    })


def create_archive(id: UUID) -> ResultWithData[UUID]:
    folder_location = "src/b"

    meeting = get_meeting_data_by_id(id)

    if os.path.exists(folder_location):
        # Delete any old files.
        shutil.rmtree(folder_location)

    os.makedirs(folder_location)
    file_paths = get_file_paths(id)

    for path in file_paths:
        shutil.copy(path, folder_location)

    archives_location = "archives"
    folder_name = f"src/{archives_location}"
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    archive_name = f"{archives_location}/documents_lp{meeting.lp}_{meeting.meeting_no}_{meeting.year}"
    print(f"Archiving folder: {folder_location}\nTo file: {archive_name}")
    shutil.make_archive(archive_name, "zip", folder_location)

    old_archive = get_archive_data_by_meeting_id(meeting.id)
    if old_archive is None:
        # Create a new archive.
        new_archive = create_archive_code(meeting.id, archive_name)
    else:
        # Update the archive for this meeting with the new zip file.
        new_archive = update_archive_location(old_archive.code, archive_name)

    if new_archive is None:
        return get_result_with_error("Failed creating/updating archive")
    return get_result_with_data(new_archive.code)
