import tensorflow as tf
import matplotlib.pyplot as plt
import os

DEFAULT_CONTENT_PATH = '../images/content/pexels-philippe-alamazani-508356-28479799.jpg'
DEFAULT_STYLE_PATH = '../images/style/download.jpeg'


def load_image(path_to_img: str, max_dim: int = 512) -> tf.Tensor:
    img = tf.io.read_file(path_to_img)
    img = tf.image.decode_image(img, channels=3)
    img = tf.cast(img, tf.float32)
    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    img = tf.image.resize(img, new_shape)
    img = img / 255.0
    img = img[tf.newaxis, :]
    return img


def load_image_from_bytes(image_bytes: bytes, max_dim: int = 512) -> tf.Tensor:
    img = tf.image.decode_image(image_bytes, channels=3)
    img = tf.cast(img, tf.float32)
    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    img = tf.image.resize(img, new_shape)
    img = img / 255.0
    img = img[tf.newaxis, :]
    return img


def imshow(image, title=None):
    if len(image.shape) > 3:
        image = tf.squeeze(image, axis=0)
    plt.imshow(image)
    if title:
        plt.title(title)


class ImageProcessor:
    def __init__(self, max_dim: int = 512):
        self.max_dim = max_dim
        self.content_image = None
        self.style_image = None
    
    def load_content_from_path(self, path: str):
        self.content_image = load_image(path, self.max_dim)
        return self.content_image
    
    def load_style_from_path(self, path: str):
        self.style_image = load_image(path, self.max_dim)
        return self.style_image
    
    def load_content_from_bytes(self, image_bytes: bytes):
        self.content_image = load_image_from_bytes(image_bytes, self.max_dim)
        return self.content_image
    
    def load_style_from_bytes(self, image_bytes: bytes):
        self.style_image = load_image_from_bytes(image_bytes, self.max_dim)
        return self.style_image
    
    def get_images(self):
        return self.content_image, self.style_image


# Load default images for backward compatibility
content_image = load_image(DEFAULT_CONTENT_PATH) if os.path.exists(DEFAULT_CONTENT_PATH) else None
style_image = load_image(DEFAULT_STYLE_PATH) if os.path.exists(DEFAULT_STYLE_PATH) else None

# Uncomment below for visualization
# plt.subplot(1,2,1)
# imshow(content_image,'Content Image')

# plt.subplot(1,2,2)
# imshow(style_image,'Style Image')

# plt.show()

