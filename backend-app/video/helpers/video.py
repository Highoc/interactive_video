from application import settings
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


import boto3

def get_file_url(bucket, user, key):
    session = boto3.session.Session()
    s3_client = session.client(
        service_name='s3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

    url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': bucket,
            'Key': f'source_video/{user.id}/{key}',
        }
    )
    return url
