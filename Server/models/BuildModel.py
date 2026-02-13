import sys
sys.path.append('../src')
from utlis import style_layers, style_image

import tensorflow as tf


def vgg_layers(layers_names):
    """Creates a VGG Model that returns a list of intermediate output values."""
    vgg = tf.keras.applications.VGG19(include_top=False, weights='imagenet')
    vgg.trainable = False

    outputs = [vgg.get_layer(name).output for name in layers_names]

    model = tf.keras.Model([vgg.input], outputs)

    return model


style_extractor = vgg_layers(style_layers)

style_outputs = style_extractor(style_image*255)

