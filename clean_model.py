import h5py
import json

file_path = "backend/acne2812022.h5"

with h5py.File(file_path, "r+") as f:
    if "model_config" in f.attrs:
        model_config = f.attrs.get("model_config")
        
        if isinstance(model_config, bytes):
            model_config = model_config.decode('utf-8')
            
        config = json.loads(model_config)
        
        def clean_layer(layer):
            if "config" in layer:
                c = layer["config"]
                # For InputLayer, ensure shape is present
                if layer.get("class_name") == "InputLayer":
                    c["shape"] = [224, 224, 3] # Provide shape only
                    c.pop("batch_input_shape", None)
                    c.pop("batch_shape", None)
                    c.pop("optional", None)
                
                # Remove from Dense
                c.pop("quantization_config", None)
                
        if config.get("class_name") == "Sequential":
            for layer in config.get("config", {}).get("layers", []):
                clean_layer(layer)
        elif config.get("class_name") == "Functional" or config.get("class_name") == "Model":
            for layer in config.get("config", {}).get("layers", []):
                clean_layer(layer)
                
        new_config_str = json.dumps(config)
        f.attrs["model_config"] = new_config_str.encode('utf-8')
        print("Model config cleaned and shape restored successfully.")
    else:
        print("No model_config found in attributes.")
