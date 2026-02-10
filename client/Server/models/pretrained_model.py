import sys
sys.path.append('../src')

import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import PIL.Image
from utlis import content_image, style_image

def tensor_to_image(tensor):
    tensor = tensor*255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor)>3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)


hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')
stylized_image = hub_model(tf.constant(content_image), tf.constant(style_image))[0]
result_image = tensor_to_image(stylized_image)
result_image.show()