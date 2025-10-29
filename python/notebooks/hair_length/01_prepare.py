import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # Prepare Hair Length Dataset from CelebAMask-HQ (3 Classes)

    This notebook prepares a hair length classification dataset using CelebAMask-HQ hair segmentation masks.

    ## Classes (Combined for better balance):
    - **short**: < 20% hair coverage (includes bald and short - combined for more samples)
    - **medium**: 20-35% hair coverage
    - **long**: > 35% hair coverage

    ## Dataset:
    - **Source**: CelebAMask-HQ (symlinked from Kaggle cache)
    - **Size**: 30,000 high-res images (1024x1024) with pixel-perfect hair segmentation masks
    - **Location**: `data/celebamask-hq/` (symlink to `~/.cache/kagglehub/.../CelebAMask-HQ`)
    - **Method**: Calculate hair coverage ratio from segmentation masks
    """
    )
    return


@app.cell
def _():
    import os
    import shutil
    import numpy as np
    import cv2
    from pathlib import Path
    from tqdm import tqdm
    from collections import Counter
    return Counter, Path, cv2, np, shutil, tqdm


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Load Dataset from Symlink""")
    return


@app.cell
def _(Path):
    # Dataset paths (using symlink)
    CELEBAMASK_PATH = Path('./data/celebamask-hq')
    IMG_DIR = CELEBAMASK_PATH / 'CelebA-HQ-img'
    MASK_DIR = CELEBAMASK_PATH / 'CelebAMask-HQ-mask-anno'

    print("📁 Dataset paths:")
    print(f"   Dataset root: {CELEBAMASK_PATH}")
    print(f"   Images: {IMG_DIR}")
    print(f"   Masks: {MASK_DIR}")

    # Verify paths exist
    if not CELEBAMASK_PATH.exists():
        print("\n❌ ERROR: Symlink not found!")
        print("   Please create symlink:")
        print("   cd python/data")
        print("   ln -s ~/.cache/kagglehub/datasets/ipythonx/celebamaskhq/versions/1/CelebAMask-HQ celebamask-hq")
    else:
        # Count files
        img_files = list(IMG_DIR.glob('*.jpg'))
        mask_subdirs = [d for d in MASK_DIR.iterdir() if d.is_dir()]
    
        print(f"\n✅ Dataset loaded:")
        print(f"   Images: {len(img_files):,}")
        print(f"   Mask subdirectories: {len(mask_subdirs)}")
    return MASK_DIR, img_files


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Configuration""")
    return


@app.cell
def _(Path):
    # Output paths
    OUTPUT_PATH = Path('./data/hair-length-3class')
    HAIR_LENGTHS = ['short', 'medium', 'long']
    THRESHOLDS = {'short': 0.2, 'medium': 0.35, 'long': 1.0}
    # Hair coverage thresholds - 3 classes (combined bald+short)
    SAMPLES_PER_CLASS = 100000
    for _length in HAIR_LENGTHS:  # < 20% - includes bald, buzz cuts, and short
        (OUTPUT_PATH / _length).mkdir(parents=True, exist_ok=True)  # 20-35% - shoulder to mid-back
    print(f'✅ Output directories created at {OUTPUT_PATH}')  # > 35% - long hair
    print(f'\n📊 Hair length thresholds (3 classes):')
    print(f'   short:  < 20% hair coverage (bald + short combined)')
    # No target limit - use all available samples
    print(f'   medium: 20-35% coverage')  # Effectively unlimited
    # Create output directories
    print(f'   long:   > 35% coverage')
    return HAIR_LENGTHS, OUTPUT_PATH, SAMPLES_PER_CLASS, THRESHOLDS


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Helper Functions""")
    return


@app.cell
def _(THRESHOLDS, cv2, np):
    def load_hair_mask(img_id, mask_dir):
        """Load hair segmentation mask for given image ID"""
        # Masks are organized in subdirectories 0-14
        # Each subdirectory contains ~2000 masks
        # Mask naming: {img_id}_hair.png
    
        # Find which subdirectory contains this mask
        folder_idx = img_id // 2000  # 0-14
        mask_path = mask_dir / str(folder_idx) / f"{img_id:05d}_hair.png"
    
        if not mask_path.exists():
            return None
    
        mask = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)
        return mask

    def calculate_hair_ratio(mask):
        """Calculate ratio of hair pixels to total pixels"""
        if mask is None:
            return 0.0
        total_pixels = mask.shape[0] * mask.shape[1]
        hair_pixels = np.sum(mask > 0)
        return hair_pixels / total_pixels

    def classify_hair_length(hair_ratio):
        """Classify hair length based on coverage ratio (3 classes)"""
        if hair_ratio < THRESHOLDS['short']:
            return 'short'
        elif hair_ratio < THRESHOLDS['medium']:
            return 'medium'
        else:
            return 'long'

    print("✅ Helper functions defined (3-class classification)")
    return calculate_hair_ratio, classify_hair_length, load_hair_mask


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Process Dataset""")
    return


@app.cell
def _(
    Counter,
    HAIR_LENGTHS,
    MASK_DIR,
    OUTPUT_PATH,
    SAMPLES_PER_CLASS,
    calculate_hair_ratio,
    classify_hair_length,
    img_files,
    load_hair_mask,
    shutil,
    tqdm,
):
    # Process images and classify by hair length
    class_counts = Counter()
    processed = 0
    skipped = 0

    print("🔄 Processing CelebAMask-HQ dataset...")
    print(f"   Total images: {len(img_files):,}\n")

    for img_file in tqdm(img_files, desc="Processing"):
        try:
            # Extract image ID from filename (e.g., "12345.jpg" -> 12345)
            img_id = int(img_file.stem)
        
            # Load corresponding hair mask
            mask = load_hair_mask(img_id, MASK_DIR)
        
            if mask is None:
                skipped += 1
                continue
        
            # Calculate hair ratio and classify
            hair_ratio = calculate_hair_ratio(mask)
            length_class = classify_hair_length(hair_ratio)
        
            # Check if we need more samples for this class
            if class_counts[length_class] >= SAMPLES_PER_CLASS:
                continue
        
            # Copy image to appropriate class folder
            output_file = OUTPUT_PATH / length_class / f"{img_id:05d}.jpg"
            shutil.copy2(img_file, output_file)
        
            class_counts[length_class] += 1
            processed += 1
        
            # Stop if all classes are full
            if all(class_counts.get(c, 0) >= SAMPLES_PER_CLASS for c in HAIR_LENGTHS):
                print("\n✅ All classes filled!")
                break
            
        except Exception as e:
            skipped += 1
            if skipped < 10:  # Only print first few errors
                print(f"\nError processing {img_file}: {e}")

    print(f"\n✅ Processed {processed:,} images")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped:,} images (no hair mask or errors)")
    return (class_counts,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Dataset Statistics""")
    return


@app.cell
def _(HAIR_LENGTHS, OUTPUT_PATH, class_counts, cv2):
    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(2, 4, figsize=(16, 8))
    # Show sample images from each class
    fig.suptitle('Sample Images from Each Hair Length Class', fontsize=16)
    for idx, _length in enumerate(HAIR_LENGTHS):
        sample_files = list((OUTPUT_PATH / _length).glob('*.jpg'))[:2]
        for row, sample_file in enumerate(sample_files):
            if len(sample_files) > row:
                img = cv2.imread(str(sample_file))
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                axes[row, idx].imshow(img)
                axes[row, idx].set_title(f'{_length}\n({class_counts[_length]} samples)')
                axes[row, idx].axis('off')
    plt.tight_layout()
    plt.show()
    print('\n✅ Dataset preparation complete!')
    print(f'📁 Ready to train with: {OUTPUT_PATH}')
    print(f'\n💡 Next step: Run 02_train_hair_length_celebamask.ipynb')
    return


@app.cell
def _():
    import marimo as mo
    return (mo,)


if __name__ == "__main__":
    app.run()
