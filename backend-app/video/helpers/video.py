import uuid

def generate_key():
    return str(uuid.uuid4().hex)

import filetype

supported_mime_types = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
]

def get_mime_type(filename):
    return filetype.guess(filename).mime

def is_supported_mime_type(mime_type):
    return mime_type in supported_mime_types
