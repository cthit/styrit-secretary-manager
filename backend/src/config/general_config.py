# File locations
config_file_location = "config/config.json"
meeting_config_file_location = "config/meeting_config.json"

# Urls
frontend_url = "localhost:3000"
document_template_url = "https://www.overleaf.com/read/ddjdhxnkxttj"
gotify_url = "http://gotify:8080/mail"

# Email addresses
my_email = "sekreterare@chalmers.it"
board_email = "styrit@chalmers.it"
group_email_domain = "@chalmers.it"
from_email_address = "admin@chalmers.it"

mail_to_groups_message = '''
Hej {0}!
    
Den {1}/{2} är det dags för sektionsmöte och senast {3} den {4} behöver ni lämna in följande dokument: 
{5}
Detta görs på sidan: {6}
Ange koden: {7}

Mall för vissa dokument finns här: {8}
Gör en kopia av projektet (Menu -> Copy Project) och fyll i.

Om ni har några frågor eller stöter på några problem kan kan ni kontakta mig på {9} eller hela {10} på {11} :).
'''

board_display_name = "styrIT"
minutes_after_deadline_to_mail = 5