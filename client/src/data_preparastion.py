import tensorflow as tf
import matplotlib.pyplot as plt
import matplotlib as mpl

content_path = '../images/content/pexels-philippe-alamazani-508356-28479799.jpg'
style_path = '../images/style/download.jpeg'

def load_image(path_to_img):
    max_dim = 512
    img = tf.io.read_file(path_to_img)
    img  = tf.image.decode_image(img, channels=3)
    img = tf.cast(img, tf.float32)

    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim/ long_dim

    new_shape = tf.cast(shape*scale, tf.int32)

    img = tf.image.resize(img, new_shape)
    img = img / 255.0
    img = img[tf.newaxis, :]
    return img


def imshow(image, title=None):
    if len(image.shape)>3:
        image = tf.squeeze(image,axis=0)

    plt.imshow(image)
    if title:
        plt.title(title)

content_image = load_image(content_path)
style_image = load_image(style_path)

# plt.subplot(1,2,1)
# imshow(content_image,'Content Image')

# plt.subplot(1,2,1)
# imshow(style_image,'Style Image')

# plt.show()

