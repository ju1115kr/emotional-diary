#!/usr/bin/env python

import argparse
import io
import datetime

from google.cloud import vision
from google.cloud.vision import types
from PIL import Image, ImageDraw


def detect_face(face_file, max_results=4):
    client = vision.ImageAnnotatorClient()

    content = face_file.read()
    image = types.Image(content=content)

    return client.face_detection(image=image).face_annotations


def highlight_faces(image, faces, output_filename):
    im = Image.open(image)
    draw = ImageDraw.Draw(im)

    for face in faces:
        box = [(vertex.x, vertex.y)
               for vertex in face.bounding_poly.vertices]
        draw.line(box + [box[0]], width=5, fill='#00ff00')

        for mark in face.landmarks:
            draw.point((mark.position.x, mark.position.y), fill='#00ff00')
    im.save(output_filename)


def labeling_face(path):
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    response = client.face_detection(image=image)
    faces = response.face_annotations
    face = faces[0]

    likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE',
                       'LIKELY', 'VERY_LIKELY')

    json_result = {
        'anger: {}'.format(likelihood_name[face.anger_likelihood]),
        'joy: {}'.format(likelihood_name[face.joy_likelihood]),
        'surprise: {}'.format(likelihood_name[face.surprise_likelihood]),
        'sorrow: {}'.format(likelihood_name[face.sorrow_likelihood]),
    }
    return json_result
