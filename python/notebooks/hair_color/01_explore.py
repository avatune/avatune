import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell
def _():
    import kagglehub
    from pathlib import Path
    import cv2
    import numpy as np
    import matplotlib.pyplot as plt
    import os
    import pandas as pd

    # Verify kagglehub is installed
    print(f"KaggleHub version: {kagglehub.__version__}")
    return Path, cv2, kagglehub, os, pd, plt


@app.cell
def _(Path, kagglehub, os, shutil, target_path):
    CELEBA_PATH = Path('./data/celeba')

    def download_celeba():
        """Download CelebA dataset from Kaggle"""
    
        print("📦 Downloading CelebA dataset...")
        print("Note: This is a large dataset (~1.4 GB)")
    
        # Download dataset
        dataset_path = kagglehub.dataset_download('jessicali9530/celeba-dataset')
    
        print(f"✅ Downloaded to: {dataset_path}")
    
        if os.name == 'posix':  # Unix-like systems
            if CELEBA_PATH.exists():
                CELEBA_PATH.unlink()
            CELEBA_PATH.symlink_to(dataset_path, target_is_directory=True)
            print(f"✅ Created symlink: {CELEBA_PATH} -> {dataset_path}")
        else:
            # Windows: copy
            if target_path.exists():
                shutil.rmtree(CELEBA_PATH)
            shutil.copytree(dataset_path, CELEBA_PATH)
            print(f"✅ Copied to: {CELEBA_PATH}")
    

    def check_celeba_structure():
        """Check CelebA dataset structure"""
        if not CELEBA_PATH.exists():
            print("❌ CelebA dataset not found")
            return
    
        print("\n📁 CelebA Dataset Structure:")
        for item in sorted(CELEBA_PATH.iterdir())[:20]:
            if item.is_dir():
                file_count = len(list(item.iterdir()))
                print(f"  📂 {item.name}/ ({file_count} files)")
            else:
                size = item.stat().st_size / (1024 * 1024)  # MB
                print(f"  📄 {item.name} ({size:.1f} MB)")
    return CELEBA_PATH, check_celeba_structure, download_celeba


@app.cell
def _(check_celeba_structure, download_celeba):
    download_celeba()
    check_celeba_structure()
    return


@app.cell
def _(CELEBA_PATH, Path):
    def find_celeba_paths(base_path):
        """Find images and attributes in CelebA dataset"""
        paths = {}
        base_path = Path(base_path)
    
        # Find images directory
        image_candidates = [
            base_path / 'img_align_celeba' / 'img_align_celeba',
            base_path / 'img_align_celeba',
            base_path / 'images',
        ]
    
        for img_dir in image_candidates:
            if img_dir.exists() and img_dir.is_dir():
                image_files = list(img_dir.glob('*.jpg'))
                if image_files:
                    paths['images'] = img_dir
                    print(f"✅ Found images: {img_dir}")
                    print(f"   Count: {len(image_files)}")
                    break

        attr_candidates = [
            base_path / 'list_attr_celeba.csv',
            base_path / 'list_attr_celeba.txt',
        ]
    
        for attr_file in attr_candidates:
            if attr_file.exists():
                paths['attributes'] = attr_file
                print(f"✅ Found attributes: {attr_file}")
                break
    
        return paths


    celeba_paths = find_celeba_paths(CELEBA_PATH)

    CELEBA_IMAGES = celeba_paths.get('images')
    CELEBA_ATTRS = celeba_paths.get('attributes')
    return CELEBA_ATTRS, CELEBA_IMAGES


@app.cell
def _(CELEBA_ATTRS, pd):
    def load_celeba_attributes(attr_file):
        """Load CelebA attributes file"""
        if attr_file.suffix == '.csv':
            df = pd.read_csv(attr_file)
        else:  # CSV format
            with open(attr_file, 'r') as f:
                lines = f.readlines()
            num_images = int(lines[0].strip())  # TXT format
            attr_names = lines[1].strip().split()  # First line: number of images
            data = []  # Second line: attribute names
            for line in lines[2:]:  # Rest: image_id and attributes (-1 or 1)
                parts = line.strip().split()
                if len(parts) > 0:
                    image_id = parts[0]
                    values = [int(x) for x in parts[1:]]  # Parse header
                    data.append([image_id] + values)
            df = pd.DataFrame(data, columns=['image_id'] + attr_names)
            for col in attr_names:
                df[col] = df[col].apply(lambda x: 1 if x == 1 else 0)  # Parse data
        return df
    if CELEBA_ATTRS:
        print('\n📊 Loading attributes...')
        df_attrs = load_celeba_attributes(CELEBA_ATTRS)
        print(f'✅ Loaded {len(df_attrs)} images with {len(df_attrs.columns) - 1} attributes')
        print(f'\nFirst few rows:')
        print(df_attrs.head())
        print('\n📋 Available attributes:')
        attr_cols = [col for col in df_attrs.columns if col != 'image_id']
        for i, _attr in enumerate(attr_cols, 1):
            _count = df_attrs[_attr].sum()  # Convert -1/1 to 0/1
            _percentage = _count / len(df_attrs) * 100
            print(f'  {i:2d}. {_attr:20s}: {_count:6d} ({_percentage:5.1f}%)')  # Show available attributes
    return (df_attrs,)


@app.cell
def _(df_attrs):
    print('\n🎨 Hair Color Attributes:')
    HAIR_ATTRS = ['Black_Hair', 'Blond_Hair', 'Brown_Hair', 'Gray_Hair']
    for _attr in HAIR_ATTRS:
        if _attr in df_attrs.columns:
            _count = df_attrs[_attr].sum()
            _percentage = _count / len(df_attrs) * 100
            print(f'  {_attr:15s}: {_count:6d} ({_percentage:5.1f}%)')
    print('\n📊 Hair attribute statistics:')
    print(f'  Total images: {len(df_attrs)}')
    hair_count = df_attrs[HAIR_ATTRS].sum(axis=1)
    # Note: Some images may have multiple hair attributes or none
    # Let's check overlaps
    print(f'  No hair color: {(hair_count == 0).sum()}')
    print(f'  One hair color: {(hair_count == 1).sum()}')
    print(f'  Multiple hair colors: {(hair_count > 1).sum()}')
    return (HAIR_ATTRS,)


@app.cell
def _(HAIR_ATTRS, df_attrs):
    def create_hair_color_labels(df, hair_attrs):
        """Create single hair color label from attributes
    
        Priority: Black > Brown > Blond > Gray > Unknown
        """
        labels = []
        for idx, row in df.iterrows():
            if row['Black_Hair'] == 1:
                labels.append('black')
            elif row['Brown_Hair'] == 1:
                labels.append('brown')
            elif row['Blond_Hair'] == 1:
                labels.append('blond')
            elif row['Gray_Hair'] == 1:
                labels.append('gray')
            else:
                labels.append('unknown')
        return labels
    df_attrs['hair_color'] = create_hair_color_labels(df_attrs, HAIR_ATTRS)
    print('\n🎨 Hair color distribution:')
    hair_dist = df_attrs['hair_color'].value_counts()
    for _color, _count in hair_dist.items():
        _percentage = _count / len(df_attrs) * 100
        print(f'  {_color:10s}: {_count:6d} ({_percentage:5.1f}%)')
    return


@app.cell
def _(CELEBA_IMAGES, cv2, df_attrs, plt):
    def show_samples_by_hair_color(df, images_dir, hair_color, num_samples=10):
        """Show sample images for a specific hair color"""
        samples = df[df['hair_color'] == hair_color].head(num_samples)
        if len(samples) == 0:  # Get samples
            print(f'No samples found for {hair_color}')
            return
        fig, axes = plt.subplots(2, 5, figsize=(15, 6))
        axes = axes.flatten()
        for idx, (_, row) in enumerate(samples.iterrows()):
            if idx >= 10:
                break
            image_id = row['image_id']
            img_path = images_dir / image_id
            if img_path.exists():
                img = cv2.imread(str(img_path))
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                axes[idx].imshow(img)
                axes[idx].set_title(f'{image_id}', fontsize=8)
                axes[idx].axis('off')
            else:
                axes[idx].text(0.5, 0.5, 'Not found', ha='center', va='center')
                axes[idx].axis('off')
        for idx in range(len(samples), 10):
            axes[idx].axis('off')
        plt.suptitle(f'{hair_color.title()} Hair Samples', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.show()
    for _color in ['black', 'brown', 'blond', 'gray']:
        show_samples_by_hair_color(df_attrs, CELEBA_IMAGES, _color, num_samples=10)
    # Show samples for each hair color
    print('\n✅ Dataset exploration complete!')  # Hide unused subplots
    return


if __name__ == "__main__":
    app.run()
