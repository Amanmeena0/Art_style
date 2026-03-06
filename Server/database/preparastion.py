import tensorflow as tf
import io


def load_img_from_bytes(image_bytes: bytes, max_dim: int = 512):
    """
    Load and preprocess image from binary data
    """
    img = tf.image.decode_image(image_bytes, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)

    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim

    new_shape = tf.cast(shape * scale, tf.int32)

    img = tf.image.resize(img, new_shape)
    img = img[tf.newaxis, :]
    return img


def prepare_images(style_data: bytes, content_data: bytes):
    """
    Prepare both images for style transfer
    """
    style_image = load_img_from_bytes(style_data)
    content_image = load_img_from_bytes(content_data)
    return style_image, content_image