import IPython.display as display
import time 

from gradientDescent import train_step,image
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'models'))
from pretrained_model import tensor_to_image

start = time.time()
epochs  = 10
steps_per_epoch = 100

step = 0
for n in range(epochs):
    for m in range(steps_per_epoch):
        step +=1
        train_step(image)
        print(".", end=' ', flush=True)

    display.clear_output(wait=True)
    display.display(tensor_to_image(image))
    print("Train step: {}".format(step))

end = time.time()
print("Total time: {:.1f}".format(end-start))