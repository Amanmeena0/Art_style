import tensorflow_hub as hub
import tensorflow as tf
from matplotlib import pyplot as plt 
import numpy as np
import cv2  


model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

def load_image(img_path):
    img = tf.io.read_file(img_path)
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32) 
    img = img[tf.newaxis, :]

    return img

content_style = load_image('images/content/pexels-andre-valentim-1598864-28450067.jpg')
style_image = load_image('images/style/download (1).jpeg')


plt.show(np.squeeze(style_image))
plt.show()

styled_image = model(tf.constant(content_style), tf.constant(style_image))[0]

plt.imshow(np.squeeze(styled_image))
plt.show() 