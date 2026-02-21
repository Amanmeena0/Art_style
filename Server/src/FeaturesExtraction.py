import tensorflow as tf
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from preparastion import content_image, style_image

x = tf.keras.applications.vgg19.preprocess_input(content_image*255)
x = tf.image.resize(x,(224,  224))
vgg = tf.keras.applications.VGG19(include_top=True, weights='imagenet')
prediction_probabilites = vgg(x)

predicted_top_5 = tf.keras.applications.vgg19.decode_predictions(prediction_probabilites.numpy())[0]
[(class_name,prob) for (number, class_name, prob) in predicted_top_5]

vgg = tf.keras.applications.VGG19(include_top=False, weights='imagenet')

content_layers = ['block5_conv2']

style_layers = [
    'block1_conv1',
    'block2_conv1',
    'block3_conv1', 
    'block4_conv1', 
    'block5_conv1'
]


