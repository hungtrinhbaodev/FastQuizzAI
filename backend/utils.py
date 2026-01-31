import time
import random


def get_currrent_millisecond():
    return int(round(time.time() * 1000))


def shuffle_array(arr):
    new_array = []
    while len(arr) > 0:
        rand_index = random.randint(0, len(arr)-1)
        new_array.append(arr[rand_index])
        arr.pop(rand_index)
    return new_array


def make_list_indices(number):
    indices = []
    for i in range(number):
        indices.append(i)
    return indices
