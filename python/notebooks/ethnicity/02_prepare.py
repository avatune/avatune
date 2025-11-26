import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell
def _():
    from datasets import load_dataset
    from pathlib import Path
    import numpy as np
    from PIL import Image
    import shutil
    import os

    print("📦 Setup complete")
    return Path, load_dataset, np, os


@app.cell
def _(Path):
    FAIRFACE_OUTPUT = Path('./data/fairface-skin')

    # Race/ethnicity classes in FairFace
    RACE_CLASSES = [
        "East Asian",
        "Indian",
        "Black",
        "White",
        "Middle Eastern",
        "Latino_Hispanic",
        "Southeast Asian"
    ]

    # Maximum samples per class for balancing
    MAX_SAMPLES_PER_CLASS = 10000  # Adjust as needed

    print(f"✅ Output directory: {FAIRFACE_OUTPUT}")
    print(f"✅ {len(RACE_CLASSES)} race/ethnicity classes configured")
    print(f"✅ Max samples per class: {MAX_SAMPLES_PER_CLASS}")
    return FAIRFACE_OUTPUT, MAX_SAMPLES_PER_CLASS, RACE_CLASSES


@app.cell
def _(load_dataset, os):
    def download_fairface():
        """Download FairFace dataset from HuggingFace"""
    
        print("📦 Downloading FairFace dataset...")
        print("Note: This may take a few minutes")
    
        # Disable XET protocol for compatibility
        os.environ["HF_HUB_DISABLE_XET"] = "1"
    
        # Load dataset (padding=0.25 for tighter face crops)
        dataset = load_dataset('HuggingFaceM4/FairFace', '0.25')
    
        print(f"\n✅ Dataset loaded:")
        print(f"   Training samples: {len(dataset['train']):,}")
        print(f"   Validation samples: {len(dataset['validation']):,}")
    
        return dataset

    dataset = download_fairface()
    return (dataset,)


@app.cell
def _(RACE_CLASSES, dataset, np):
    def analyze_distribution(dataset):
        """Analyze race/ethnicity distribution"""
    
        train_races = [sample['race'] for sample in dataset['train']]
        race_counts = np.bincount(train_races)
    
        print("\n📊 Original distribution:")
        total = len(train_races)
        for i, class_name in enumerate(RACE_CLASSES):
            count = race_counts[i]
            percentage = (count / total) * 100
            print(f"  {class_name:20s}: {count:6,} ({percentage:5.1f}%)")
    
        print(f"\n  Total: {total:,}")
    
        return race_counts

    race_counts = analyze_distribution(dataset)
    return


@app.cell
def _(MAX_SAMPLES_PER_CLASS, RACE_CLASSES, dataset, np):
    def balance_dataset(dataset, max_samples_per_class):
        """Balance dataset by limiting samples per class"""
    
        print(f"\n⚖️  Balancing dataset (max {max_samples_per_class:,} per class)...")
    
        # Group by race
        race_groups = {i: [] for i in range(len(RACE_CLASSES))}
    
        for idx, sample in enumerate(dataset['train']):
            race_idx = sample['race']
            race_groups[race_idx].append(idx)
    
        # Sample from each group
        balanced_indices = []
    
        for race_idx, indices in race_groups.items():
            class_name = RACE_CLASSES[race_idx]
            original_count = len(indices)
        
            if original_count > max_samples_per_class:
                # Random sample
                np.random.seed(42)  # For reproducibility
                selected = np.random.choice(indices, max_samples_per_class, replace=False)
                balanced_indices.extend(selected)
                print(f"  {class_name:20s}: {original_count:6,} → {max_samples_per_class:6,}")
            else:
                balanced_indices.extend(indices)
                print(f"  {class_name:20s}: {original_count:6,} (kept all)")
    
        return sorted(balanced_indices)

    balanced_indices = balance_dataset(dataset, MAX_SAMPLES_PER_CLASS)
    print(f"\n✅ Balanced dataset size: {len(balanced_indices):,}")
    return (balanced_indices,)


@app.cell
def _(RACE_CLASSES, balanced_indices, dataset, np):
    def verify_balance(dataset, indices):
        """Verify balanced distribution"""
    
        balanced_races = [dataset['train'][idx]['race'] for idx in indices]
        balanced_counts = np.bincount(balanced_races)
    
        print("\n📊 Balanced distribution:")
        total = len(balanced_races)
        for i, class_name in enumerate(RACE_CLASSES):
            count = balanced_counts[i]
            percentage = (count / total) * 100
            print(f"  {class_name:20s}: {count:6,} ({percentage:5.1f}%)")
    
        print(f"\n  Total: {total:,}")

    verify_balance(dataset, balanced_indices)
    return


@app.cell
def _(FAIRFACE_OUTPUT, RACE_CLASSES, balanced_indices, dataset):
    def organize_images(dataset, indices, output_dir):
        """Save images to race-organized folders"""
    
        print(f"\n📁 Organizing images into: {output_dir}\n")
    
        # Create class directories
        for class_name in RACE_CLASSES:
            class_dir = output_dir / class_name.replace(' ', '_').lower()
            class_dir.mkdir(parents=True, exist_ok=True)
    
        saved = 0
        errors = 0
    
        for idx in indices:
            try:
                sample = dataset['train'][idx]
                race_idx = sample['race']
                class_name = RACE_CLASSES[race_idx]
            
                # Convert to directory-safe name
                dir_name = class_name.replace(' ', '_').lower()
            
                # Save image
                img = sample['image']
                filename = f"{saved:06d}.jpg"
                filepath = output_dir / dir_name / filename
            
                img.save(filepath)
                saved += 1
            
                if saved % 1000 == 0:
                    print(f"  Saved {saved}/{len(indices)}...")
        
            except Exception as e:
                print(f"  Error saving image {idx}: {e}")
                errors += 1
    
        print(f"\n✅ Saved {saved:,} images")
        print(f"❌ Errors: {errors}")
    
        # Verify
        print(f"\n📊 Final distribution:")
        for class_name in RACE_CLASSES:
            dir_name = class_name.replace(' ', '_').lower()
            class_dir = output_dir / dir_name
            count = len(list(class_dir.glob('*.jpg')))
            print(f"  {class_name:20s}: {count:6,}")

    organize_images(dataset, balanced_indices, FAIRFACE_OUTPUT)

    print(f"\n✅ Dataset prepared at: {FAIRFACE_OUTPUT}")
    print("Ready for training!")
    return


@app.cell
def _(FAIRFACE_OUTPUT, MAX_SAMPLES_PER_CLASS, RACE_CLASSES, balanced_indices):
    print("\n" + "="*60)
    print("📊 DATA PREPARATION SUMMARY")
    print("="*60)
    print(f"\nDataset: FairFace")
    print(f"Source: HuggingFace (HuggingFaceM4/FairFace)")
    print(f"Padding: 0.25 (tighter face crops)")
    print(f"\nBalanced Dataset:")
    print(f"  Total images: {len(balanced_indices):,}")
    print(f"  Max per class: {MAX_SAMPLES_PER_CLASS:,}")
    print(f"\nClasses:")
    for i, race in enumerate(RACE_CLASSES, 1):
        dir_name = race.replace(' ', '_').lower()
        print(f"  {i}. {race:20s} → {dir_name}/")
    print(f"\nOutput: {FAIRFACE_OUTPUT}")
    print(f"\n✅ Data preparation complete!")
    print(f"\nNext step: Train the model using this prepared dataset")
    return


if __name__ == "__main__":
    app.run()
