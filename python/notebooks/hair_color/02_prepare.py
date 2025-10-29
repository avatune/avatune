import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell
def _():
    import pandas as pd
    import cv2
    import numpy as np
    from pathlib import Path
    import shutil
    from collections import Counter

    celeba_path = Path('./data/celeba')
    output_path = Path('./data/celeba-hair')
    return celeba_path, output_path, pd, shutil


@app.cell
def _(celeba_path, pd):
    def load_celeba_attributes(base_path):
        """Load CelebA attributes"""
        attr_file = None
    
        # Find attributes file
        for candidate in [base_path / 'list_attr_celeba.csv', 
                         base_path / 'list_attr_celeba.txt']:
            if candidate.exists():
                attr_file = candidate
                break
    
        if not attr_file:
            raise FileNotFoundError("Attributes file not found")
    
        if attr_file.suffix == '.csv':
            df = pd.read_csv(attr_file)
        else:
            with open(attr_file, 'r') as f:
                lines = f.readlines()
        
            num_images = int(lines[0].strip())
            attr_names = lines[1].strip().split()
        
            data = []
            for line in lines[2:]:
                parts = line.strip().split()
                if len(parts) > 0:
                    image_id = parts[0]
                    values = [int(x) for x in parts[1:]]
                    data.append([image_id] + values)
        
            df = pd.DataFrame(data, columns=['image_id'] + attr_names)
        
            for col in attr_names:
                df[col] = df[col].apply(lambda x: 1 if x == 1 else 0)
    
        return df

    df_attrs = load_celeba_attributes(celeba_path)
    print(f"✅ Loaded {len(df_attrs)} images")
    return (df_attrs,)


@app.cell
def _(df_attrs):
    def create_hair_color_labels(df):
        """Create hair color labels with priority"""
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
    df_attrs['hair_color'] = create_hair_color_labels(df_attrs)
    df_attrs_1 = df_attrs[df_attrs['hair_color'] != 'unknown']
    print(f'\n📊 Hair color distribution:')
    hair_dist = df_attrs_1['hair_color'].value_counts()
    for _color, _count in hair_dist.items():
        _percentage = _count / len(df_attrs_1) * 100
        print(f'  {_color:10s}: {_count:6d} ({_percentage:5.1f}%)')
    return (df_attrs_1,)


@app.cell
def _(df_attrs_1, pd):
    MAX_SAMPLES_PER_CLASS = 10000
    balanced_dfs = []
    for _color in ['black', 'brown', 'blond', 'gray']:
        color_df = df_attrs_1[df_attrs_1['hair_color'] == _color]
        if len(color_df) > MAX_SAMPLES_PER_CLASS:
            color_df = color_df.sample(n=MAX_SAMPLES_PER_CLASS, random_state=42)
        balanced_dfs.append(color_df)
    df_balanced = pd.concat(balanced_dfs, ignore_index=True)
    print(f'\n📊 Balanced dataset:')
    balanced_dist = df_balanced['hair_color'].value_counts()
    for _color, _count in balanced_dist.items():
        _percentage = _count / len(df_balanced) * 100
        print(f'  {_color:10s}: {_count:6d} ({_percentage:5.1f}%)')
    print(f'\nTotal samples: {len(df_balanced)}')
    return (df_balanced,)


@app.cell
def _(celeba_path, df_balanced, output_path, shutil):
    def organize_images(df, source_dir, output_dir):
        """Copy images to color-organized folders"""
        img_dir = None
        for candidate in [source_dir / 'img_align_celeba' / 'img_align_celeba', source_dir / 'img_align_celeba', source_dir / 'images']:
            if candidate.exists() and candidate.is_dir():
                img_dir = candidate
                break
        if not img_dir:
            raise FileNotFoundError('Images directory not found')
        print(f'Source images: {img_dir}')
        print(f'Output: {output_dir}\n')
        for _color in ['black', 'brown', 'blond', 'gray']:
            (output_dir / _color).mkdir(parents=True, exist_ok=True)
        copied = 0
        errors = 0
        for idx, row in df.iterrows():
            image_id = row['image_id']
            hair_color = row['hair_color']
            src = img_dir / image_id
            dst = output_dir / hair_color / image_id
            if src.exists():
                try:
                    shutil.copy(src, dst)
                    copied = copied + 1
                    if copied % 1000 == 0:
                        print(f'  Copied {copied}/{len(df)}...')
                except Exception as e:
                    print(f'  Error copying {image_id}: {e}')
                    errors = errors + 1
            else:
                errors = errors + 1
        print(f'\n✅ Copied {copied} images')
        print(f'❌ Errors: {errors}')
        print(f'\n📊 Final distribution:')
        for _color in ['black', 'brown', 'blond', 'gray']:
            _count = len(list((output_dir / _color).glob('*.jpg')))
            print(f'  {_color:10s}: {_count:6d}')
    organize_images(df_balanced, celeba_path, output_path)
    print(f'\n✅ Dataset prepared at: {output_path}')
    print('Ready for training!')
    return


if __name__ == "__main__":
    app.run()
