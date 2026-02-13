import tensorflow as tf
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'models'))

from ExtractModel import extractor
from pretrained_model import tensor_to_image
from data_preparastion import style_image, content_image
from FeaturesExtraction import content_layers, style_layers


num_content_layers = len(content_layers)
num_style_layers = len(style_layers)

style_targets = extractor(style_image)['style']
content_targets = extractor(content_image)['content']


image = tf.Variable(content_targets)

def clip_0_1(image):
    return tf.clip_by_value(image, clip_value_min=0.0, clip_value_max=1.0)

opt = tf.keras.optimizers.Adam(learning_rate=0.02, beta_1=0.99, epsilor=1e-1)

style_weight = 1e-2
content_weight = 1e4

def style_content_loss(outputs):
    style_outputs = outputs['style']
    content_outputs = outputs['content']
    style_loss = tf.add_n([tf.reduce_mean((style_outputs[name]-style_targets[name])**2) for name in content_outputs.keys()])
    style_loss *= style_weight/ num_style_layers

    content_loss = tf.add_n([tf.reduce_mean((content_outputs[name] - content_targets[name])**2 ) for name in content_outputs.key()])

    content_loss *= content_weight/ num_content_layers

    loss = style_loss + content_loss

    return loss


@tf.function()
def train_step(image):
    with tf.GradientTape() as tape:
        output = extractor(image)
        loss = style_content_loss(output)

    grad = tape.gradient(loss, image)
    opt.apply_gradients([(grad, image)])
    image.assign(clip_0_1(image))


train_step(image)
train_step(image)
train_step(image)
tensor_to_image(image)