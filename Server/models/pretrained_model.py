
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import PIL.Image
import io


# Load model once at module level
hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')


def tensor_to_image(tensor):
    """Convert tensor to PIL Image"""
    tensor = tensor * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor) > 3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)


def image_to_bytes(image: PIL.Image.Image, format: str = "PNG") -> bytes:
    """Convert PIL Image to bytes"""
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    buffer.seek(0)
    return buffer.getvalue()


def run_style_transfer(content_image: tf.Tensor, style_image: tf.Tensor) -> bytes:
    """
    Run style transfer and return result as bytes
    """
    stylized_image = hub_model(tf.constant(content_image), tf.constant(style_image))[0]
    result_image = tensor_to_image(stylized_image)
    return image_to_bytes(result_image)