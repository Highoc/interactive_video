from application import settings

import short_url

def get_short_key(id):
    return short_url.encode_url(id, min_length=12)


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

from pymediainfo import MediaInfo

'''
    ffmpeg -i source.mp4 -ss <start_time> -t <duration> part.mp4
    MP4Box -dash 5000 -frag 5000 -rap part.mp4 

'''

supported_mime_types = [
    'video/mp4',
]

def is_supported_mime_type(mime_type):
    return mime_type in supported_mime_types

VIDEO_CODECS = {
    'video/mp4': {
        'AVC': {
            'Baseline': 'avc1.42E0{}',
            'Main': 'avc1.4240{}',
            'High': 'avc1.6400{}',
        },
        'MPEG-4': {
            'VSPL': 'mp4v.20.9',
            'VASPL': 'mp4v.20.9',
        }
    },
}

AUDIO_CODECS = {
    'video/mp4': {
        'AAC': 'mp4a.40.2'
    },
}

def get_mime_type(filename):
    media_info = MediaInfo.parse(filename)
    return media_info.tracks[0].internet_media_type

def get_video_codec(filename):
    media_info = MediaInfo.parse(filename)
    for track in media_info.tracks:
        if track.track_type == 'Video':
            codec = track.codec
            if codec == 'AVC':
                (type, version) = track.format_profile.split('@L', 1)
                if '.' in version:
                    (major_version, minor_version) = version.split('.', 1)
                else:
                    (major_version, minor_version) = (version, 0)

                hex_version = format((int(major_version)*10 + int(minor_version)), 'X')
                return VIDEO_CODECS['video/mp4'][codec][type].format(hex_version)
            else:
                return ""

def get_audio_codec(filename):
    '''
    media_info = MediaInfo.parse(filename)
    for track in media_info.tracks:
        if track.track_type == 'Audio':
            codec = track.codec
            format_profile = track.format_profile
    '''
    return AUDIO_CODECS['video/mp4']['AAC']

def get_codec(filename):
    return f'{get_video_codec(filename)}, {get_audio_codec(filename)}'

def get_duration(filename):
    media_info = MediaInfo.parse(filename)
    return media_info.tracks[0].duration/1000


def get_image_url(image):
    if not image:
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
            'Key': image.name,
        }
    )

    return url
