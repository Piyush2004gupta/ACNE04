"""
Image preprocessing utilities for the Acne Severity Classification System.
Handles image loading, resizing, normalization, and preparation for model inference.
"""

import numpy as np
from PIL import Image
import io


# Default model input dimensions
MODEL_INPUT_SIZE = (224, 224)


def preprocess_image(file_storage):
    """
    Preprocess an uploaded image for model prediction.
    
    Steps:
        1. Read the image from file storage
        2. Convert to RGB (handles RGBA, grayscale, etc.)
        3. Resize to model input dimensions (224x224)
        4. Normalize pixel values to [0, 1]
        5. Expand dimensions for batch prediction
    
    Args:
        file_storage: Flask FileStorage object from request.files
        
    Returns:
        numpy.ndarray: Preprocessed image array with shape (1, 224, 224, 3)
        
    Raises:
        ValueError: If the file cannot be read as an image
    """
    try:
        # Read image from file storage
        image_bytes = file_storage.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB (ensures 3 channels)
        image = image.convert("RGB")
        
        # Resize to model input dimensions
        image = image.resize(MODEL_INPUT_SIZE, Image.LANCZOS)
        
        # Convert to numpy array and normalize pixel values to [0, 1]
        img_array = np.array(image, dtype=np.float32) / 255.0
        
        # Expand dimensions to create batch of 1: (224, 224, 3) -> (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
        
    except Exception as e:
        raise ValueError(f"Failed to preprocess image: {str(e)}")
