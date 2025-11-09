# @avatune/python

Training pipeline for avatar analysis models using Marimo notebooks. Models are trained in Python with TensorFlow/Keras, then automatically exported to TensorFlow.js for browser inference.

## Structure

```
notebooks/
├── hair_color/
│   ├── 01_explore.py    # Dataset analysis
│   ├── 02_prepare.py    # Class balancing and image preparation
│   └── 03_train.py      # Training + TFJS export
│
├── hair_length/
│   ├── 01_prepare.py
│   └── 02_train.py
│
└── skin_tone/
    ├── 01_explore.py
    ├── 02_prepare.py
    ├── 03_prepare_3class.py
    └── 04_train.py
```

## Running Notebooks

Install dependencies:
```bash
uv pip install marimo
```

Interactive mode (opens in browser):
```bash
marimo edit python/notebooks/hair_color/03_train.py
```

Headless execution:
```bash
marimo run python/notebooks/hair_color/03_train.py
```

## Models

| Model       | Classes                   | Dataset       | Accuracy |
| ----------- | ------------------------- | ------------- | -------- |
| Hair Color  | black, brown, blond, gray | CelebA        | ~79%     |
| Skin Tone   | dark, medium, light       | FairFace      | ~68%     |
| Hair Length | short, medium, long       | CelebAMask-HQ | ~82%     |

All models use MobileNetV2 architecture with 128x128 input images.

## Output

Training notebooks automatically:
- Save Keras model to `models/{model_name}.keras`
- Export metadata to `models/{model_name}_classes.json` and `models/{model_name}_history.json`
- Convert to TensorFlow.js format with uint8 quantization
- Output TFJS files to `models/tfjs/{model_name}/`

TFJS output structure:
```
models/tfjs/hair-color/
├── model.json
├── group1-shard1of1.bin
└── classes.json
```

## Paths

Notebooks use relative paths from their location:
- Data: `../../data/`
- Models: `../../../models/`

## Workflow

Standard workflow for each model:

1. Explore dataset distribution and characteristics
2. Prepare balanced training set
3. Train model and export to TFJS

Example for hair color:
```bash
marimo run python/notebooks/hair_color/01_explore.py
marimo run python/notebooks/hair_color/02_prepare.py
marimo run python/notebooks/hair_color/03_train.py
```

After training, TFJS models are ready for use in the TypeScript predictor packages.
