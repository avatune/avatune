# Marimo Notebooks - ProfileKit Photo-to-Config

Interactive marimo notebooks for training ML models to analyze profile photos.

## 📁 Folder Structure

```
notebooks/
├── hair_color/          # Hair color classification (4 classes)
│   ├── 01_explore.py    # Explore CelebA dataset
│   ├── 02_prepare.py    # Prepare balanced dataset
│   └── 03_train.py      # Train model + TFJS conversion ✨
│
├── hair_length/         # Hair length classification (3 classes)
│   ├── 01_prepare.py    # Prepare dataset from segmentation masks
│   └── 02_train.py      # Train model + TFJS conversion ✨
│
└── skin_tone/           # Skin tone classification (3 classes)
    ├── 01_explore.py    # Explore FairFace dataset
    ├── 02_prepare.py    # Prepare dataset
    ├── 03_prepare_3class.py  # Prepare 3-class with realistic backgrounds
    └── 04_train.py      # Train model + TFJS conversion ✨
```

## 🚀 Running Notebooks

### Install marimo
```bash
uv pip install marimo
```

### Run a notebook
```bash
# Interactive mode (opens in browser)
marimo edit python/notebooks/hair_color/03_train.py

# Run all cells
marimo run python/notebooks/hair_color/03_train.py
```

## 📊 Models

All training notebooks include automatic TensorFlow.js conversion:

| Model | Classes | Dataset | Accuracy |
|-------|---------|---------|----------|
| **Hair Color** | black, brown, blond, gray | CelebA | ~79% |
| **Skin Tone** | dark, medium, light | FairFace | ~68% |
| **Hair Length** | short, medium, long | CelebAMask-HQ | ~82% |

## ✨ TensorFlow.js Conversion

Each training notebook (`*_train.py`) includes a final cell that:
- Converts the trained Keras model to TFJS format
- Applies uint8 quantization for smaller file sizes
- Copies class labels to output directory
- Outputs to `models/tfjs/{model-name}/`

Output structure:
```
models/
└── tfjs/
    ├── hair-color/
    │   ├── model.json
    │   ├── group1-shard1of1.bin
    │   └── classes.json
    ├── skin-tone-3class/
    │   └── ...
    └── hair-length/
        └── ...
```

## 🔧 Paths

Notebooks use relative paths from their location:
- **Data**: `../../data/` (from `python/notebooks/{topic}/`)
- **Models**: `../../../models/` (from `python/notebooks/{topic}/`)

## 📝 Workflow

1. **Explore** - Understand the dataset and class distribution
2. **Prepare** - Balance classes and organize images
3. **Train** - Train model and convert to TFJS automatically

Example workflow for hair color:
```bash
# 1. Explore dataset
marimo run python/notebooks/hair_color/01_explore.py

# 2. Prepare balanced dataset
marimo run python/notebooks/hair_color/02_prepare.py

# 3. Train and convert to TFJS
marimo run python/notebooks/hair_color/03_train.py
```

## 🎯 Output

After training, you'll have:
- Keras model: `models/{model_name}.keras`
- Classes JSON: `models/{model_name}_classes.json`
- Training history: `models/{model_name}_history.json`
- TFJS model: `models/tfjs/{model_name}/` ✨

Ready for deployment in browser applications!
