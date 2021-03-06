from application import settings
import boto3
import short_url


def convert_to_byte_length(MB=0, KB=0):
    return MB*1024**2 + KB*1024


def get_short_key(id):
    return short_url.encode_url(id, min_length=12)


def get_file_url(key: str):
    if not key:
        return ''

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
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': key,
        }
    )

    return url


def check_image_size(size):
    return size <= convert_to_byte_length(MB=10)


SUPPORTED_MIME_TYPES = [
    'image/png'
]


def check_image_mime_type(mime_type):
    return mime_type in SUPPORTED_MIME_TYPES
