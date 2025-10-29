import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell
def _():
    from datasets import load_dataset
    from pathlib import Path
    import numpy as np
    import matplotlib.pyplot as plt
    from PIL import Image
    import os

    print("📦 Setup complete")
    return Path, load_dataset, np, os, plt


@app.cell
def _(Path):
    FAIRFACE_OUTPUT = Path('./data/fairface-skin')
    FAIRFACE_OUTPUT.mkdir(parents=True, exist_ok=True)

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

    print(f"✅ Output directory: {FAIRFACE_OUTPUT}")
    print(f"✅ {len(RACE_CLASSES)} race/ethnicity classes configured")
    return (RACE_CLASSES,)


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
    
        print(f"✅ Dataset loaded:")
        print(f"   Training samples: {len(dataset['train']):,}")
        print(f"   Validation samples: {len(dataset['validation']):,}")
    
        return dataset

    dataset = download_fairface()
    return (dataset,)


@app.cell
def _(dataset):
    def explore_dataset(dataset):
        """Explore dataset structure and attributes"""
    
        print("\n📊 Dataset Structure:")
        print(f"  Splits: {list(dataset.keys())}")
    
        sample = dataset['train'][0]
        print(f"\n  Sample features:")
        for key, value in sample.items():
            if key == 'image':
                print(f"    {key}: PIL Image {value.size}")
            else:
                print(f"    {key}: {value} (type: {type(value).__name__})")
    
        return sample

    sample = explore_dataset(dataset)
    return


@app.cell
def _(RACE_CLASSES, dataset, plt):
    def show_sample_images(dataset, num_samples=8):
        """Show sample images from the dataset"""
    
        fig, axes = plt.subplots(2, 4, figsize=(15, 8))
        axes = axes.flatten()
    
        # Sample evenly across the dataset
        step = len(dataset['train']) // num_samples
    
        for i in range(num_samples):
            idx = i * step
            sample = dataset['train'][idx]
        
            axes[i].imshow(sample['image'])
            axes[i].set_title(
                f"{RACE_CLASSES[sample['race']]}\n"
                f"Age: {sample['age']}, Gender: {sample['gender']}",
                fontsize=10
            )
            axes[i].axis('off')
    
        plt.suptitle('FairFace Dataset Samples', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.show()

    show_sample_images(dataset)
    return


@app.cell
def _(RACE_CLASSES, dataset, np, plt):
    def analyze_race_distribution(dataset):
        """Analyze and visualize race/ethnicity distribution"""
    
        # Get all race labels
        train_races = [sample['race'] for sample in dataset['train']]
        race_counts = np.bincount(train_races)
    
        # Plot distribution
        plt.figure(figsize=(12, 6))
        bars = plt.bar(RACE_CLASSES, race_counts)
    
        # Color bars for visual interest
        colors = plt.cm.Set3(np.linspace(0, 1, len(RACE_CLASSES)))
        for bar, color in zip(bars, colors):
            bar.set_color(color)
    
        plt.xlabel('Race/Ethnicity Category', fontsize=12)
        plt.ylabel('Count', fontsize=12)
        plt.title('Training Set - Race/Ethnicity Distribution', fontsize=14, fontweight='bold')
        plt.xticks(rotation=45, ha='right')
        plt.grid(axis='y', alpha=0.3)
        plt.tight_layout()
        plt.show()
    
        # Print statistics
        print("\n📊 Race/Ethnicity Distribution:")
        total = len(train_races)
        for i, class_name in enumerate(RACE_CLASSES):
            count = race_counts[i]
            percentage = (count / total) * 100
            print(f"  {class_name:20s}: {count:6,} ({percentage:5.1f}%)")
    
        print(f"\n  Total: {total:,}")

    analyze_race_distribution(dataset)
    return


@app.cell
def _(RACE_CLASSES, dataset, plt):
    def show_samples_by_race(dataset, race_name, num_samples=10):
        """Show sample images for a specific race/ethnicity"""
        race_idx = RACE_CLASSES.index(race_name)
        samples = []  # Get race index
        for sample in dataset['train']:
            if sample['race'] == race_idx:
                samples.append(sample)  # Find samples
                if len(samples) >= num_samples:
                    break
        if len(samples) == 0:
            print(f'No samples found for {race_name}')
            return
        fig, axes = plt.subplots(2, 5, figsize=(15, 6))
        axes = axes.flatten()
        for idx, sample in enumerate(samples[:10]):
            axes[idx].imshow(sample['image'])
            axes[idx].set_title(f"Age: {sample['age']}\nGender: {sample['gender']}", fontsize=9)
            axes[idx].axis('off')
        for idx in range(len(samples), 10):  # Display samples
            axes[idx].axis('off')
        plt.suptitle(f'{race_name} Samples', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.show()
    for _race in RACE_CLASSES:
    # Show samples for each race/ethnicity
        show_samples_by_race(dataset, _race, num_samples=10)  # Hide unused subplots
    return


@app.cell
def _(dataset, np, plt):
    def analyze_other_attributes(dataset):
        """Analyze age and gender distribution"""
    
        ages = [sample['age'] for sample in dataset['train']]
        genders = [sample['gender'] for sample in dataset['train']]
    
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    
        # Age distribution
        age_counts = np.bincount(ages)
        age_labels = list(range(len(age_counts)))
        ax1.bar(age_labels, age_counts, color='steelblue')
        ax1.set_xlabel('Age Group', fontsize=11)
        ax1.set_ylabel('Count', fontsize=11)
        ax1.set_title('Age Distribution', fontsize=12, fontweight='bold')
        ax1.grid(axis='y', alpha=0.3)
    
        # Gender distribution
        gender_counts = np.bincount(genders)
        gender_labels = ['Male', 'Female']
        ax2.bar(gender_labels, gender_counts, color=['lightblue', 'lightcoral'])
        ax2.set_ylabel('Count', fontsize=11)
        ax2.set_title('Gender Distribution', fontsize=12, fontweight='bold')
        ax2.grid(axis='y', alpha=0.3)
    
        plt.tight_layout()
        plt.show()
    
        print("\n📊 Age Distribution:")
        for age_group, count in enumerate(age_counts):
            percentage = (count / len(ages)) * 100
            print(f"  Age group {age_group}: {count:6,} ({percentage:5.1f}%)")
    
        print("\n📊 Gender Distribution:")
        for gender_idx, label in enumerate(gender_labels):
            count = gender_counts[gender_idx]
            percentage = (count / len(genders)) * 100
            print(f"  {label}: {count:6,} ({percentage:5.1f}%)")

    analyze_other_attributes(dataset)
    return


@app.cell
def _(RACE_CLASSES, dataset):
    print('\n' + '=' * 60)
    print('📊 DATASET EXPLORATION SUMMARY')
    print('=' * 60)
    print(f'\nDataset: FairFace')
    print(f'Source: HuggingFace (HuggingFaceM4/FairFace)')
    print(f'Padding: 0.25 (tighter face crops)')
    print(f'\nSplits:')
    print(f"  Training: {len(dataset['train']):,} images")
    print(f"  Validation: {len(dataset['validation']):,} images")
    print(f'\nFeatures:')
    print(f'  - Race/Ethnicity: {len(RACE_CLASSES)} classes')
    print(f'  - Age: Multiple age groups')
    print(f'  - Gender: Binary classification')
    print(f'\nClasses:')
    for i, _race in enumerate(RACE_CLASSES, 1):
        print(f'  {i}. {_race}')
    print(f'\n✅ Exploration complete!')
    print(f'\nNext steps:')
    print(f'  - Train a classification model')
    print(f'  - Export for TensorFlow.js')
    print(f'  - Deploy in browser')
    return


if __name__ == "__main__":
    app.run()
