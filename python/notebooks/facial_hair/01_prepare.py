import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # Prepare Facial Hair Dataset from CelebA

    Binary classification: **none** vs **facial_hair**

    ## Classes:
    - **none**: Clean shaven (no beard, mustache, goatee, or shadow)
    - **facial_hair**: Any facial hair (beard, mustache, goatee, stubble)

    ## Dataset:
    - **Source**: CelebA (~200k celebrity face images with 40 attributes)
    - **All genders included** (women correctly map to "none" in real world)
    """
    )
    return


@app.cell
def _():
    import pandas as pd
    import shutil
    from pathlib import Path
    return Path, pd, shutil


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Configuration""")
    return


@app.cell
def _(Path):
    CELEBA_PATH = Path('./data/celeba')
    OUTPUT_PATH = Path('./data/celeba-facial-hair')
    CLASSES = ['none', 'facial_hair']
    MAX_SAMPLES_PER_CLASS = 15000

    for _cls in CLASSES:
        (OUTPUT_PATH / _cls).mkdir(parents=True, exist_ok=True)

    print(f'📁 Source: {CELEBA_PATH}')
    print(f'📁 Output: {OUTPUT_PATH}')
    print(f'📊 Classes: {CLASSES}')
    print(f'📊 Max samples per class: {MAX_SAMPLES_PER_CLASS:,}')
    return CELEBA_PATH, CLASSES, MAX_SAMPLES_PER_CLASS, OUTPUT_PATH


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Load CelebA Attributes""")
    return


@app.cell
def _(CELEBA_PATH, pd):
    def _load_attrs(base_path):
        attr_file = None
        for candidate in [base_path / 'list_attr_celeba.csv',
                         base_path / 'list_attr_celeba.txt']:
            if candidate.exists():
                attr_file = candidate
                break

        if attr_file is None:
            raise FileNotFoundError("Attributes file not found in " + str(base_path))

        if attr_file.suffix == '.csv':
            _df = pd.read_csv(attr_file)
            attr_cols = [c for c in _df.columns if c != 'image_id']
            for col in attr_cols:
                _df[col] = (_df[col] == 1).astype(int)
        else:
            with open(attr_file, 'r') as f:
                lines = f.readlines()
            attr_names = lines[1].strip().split()
            data = []
            for line in lines[2:]:
                parts = line.strip().split()
                if len(parts) > 0:
                    image_id = parts[0]
                    values = [1 if int(x) == 1 else 0 for x in parts[1:]]
                    data.append([image_id] + values)
            _df = pd.DataFrame(data, columns=['image_id'] + attr_names)

        return _df

    df_attrs = _load_attrs(CELEBA_PATH)
    print(f'✅ Loaded {len(df_attrs):,} images')

    relevant_cols = ['No_Beard', 'Mustache', 'Goatee', '5_o_Clock_Shadow', 'Male']
    print('\n📊 Facial hair attribute distribution:')
    for col in relevant_cols:
        _count = df_attrs[col].sum()
        _pct = 100 * _count / len(df_attrs)
        print(f'  {col:20s}: {_count:6,} ({_pct:5.1f}%)')
    return (df_attrs,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    ## Classification Logic (Binary)

    | Class | Logic |
    |-------|-------|
    | **none** | `No_Beard=1` AND `Mustache=0` AND `Goatee=0` AND `5_o_Clock_Shadow=0` |
    | **facial_hair** | Any: `No_Beard=0` OR `Mustache=1` OR `Goatee=1` OR `5_o_Clock_Shadow=1` |
    """
    )
    return


@app.cell
def _(df_male):
    def _classify(row):
        has_any = (
            row['No_Beard'] == 0 or
            row['Mustache'] == 1 or
            row['Goatee'] == 1 or
            row['5_o_Clock_Shadow'] == 1
        )
        return 'facial_hair' if has_any else 'none'

    df_classified = df_male.copy()
    df_classified['facial_hair_class'] = df_classified.apply(_classify, axis=1)

    print('📊 Classification (males only):')
    for _cls, _count in df_classified['facial_hair_class'].value_counts().items():
        _pct = 100 * _count / len(df_classified)
        print(f'  {_cls:12s}: {_count:6,} ({_pct:5.1f}%)')
    return (df_classified,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Balance Dataset""")
    return


@app.cell
def _(CLASSES, MAX_SAMPLES_PER_CLASS, df_classified, pd):
    _balanced_list = []
    for _cls in CLASSES:
        _cls_df = df_classified[df_classified['facial_hair_class'] == _cls]
        if len(_cls_df) > MAX_SAMPLES_PER_CLASS:
            _cls_df = _cls_df.sample(n=MAX_SAMPLES_PER_CLASS, random_state=42)
        _balanced_list.append(_cls_df)
        print(f'  {_cls:12s}: {len(_cls_df):,} samples')

    df_balanced = pd.concat(_balanced_list, ignore_index=True)
    print(f'\n✅ Balanced dataset: {len(df_balanced):,} total samples')
    return (df_balanced,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Copy Images to Output Directory""")
    return


@app.cell
def _(CELEBA_PATH, CLASSES, OUTPUT_PATH, df_balanced, shutil):
    def _find_img_dir(base_path):
        candidates = [
            base_path / 'img_align_celeba' / 'img_align_celeba',
            base_path / 'img_align_celeba',
            base_path / 'images',
        ]
        for candidate in candidates:
            if candidate.exists() and candidate.is_dir():
                return candidate
        raise FileNotFoundError('Images directory not found')

    _img_dir = _find_img_dir(CELEBA_PATH)
    print(f'📁 Source images: {_img_dir}')
    print(f'📁 Output: {OUTPUT_PATH}\n')

    # Clear existing files first
    for _cls in CLASSES:
        for _f in (OUTPUT_PATH / _cls).glob('*.jpg'):
            _f.unlink()
    print('🗑️  Cleared existing files\n')

    _copied = 0
    _errors = 0

    for _idx, _row in df_balanced.iterrows():
        _image_id = _row['image_id']
        _cls = _row['facial_hair_class']

        _src = _img_dir / _image_id
        _dst = OUTPUT_PATH / _cls / _image_id

        if _src.exists():
            try:
                shutil.copy(_src, _dst)
                _copied += 1
                if _copied % 5000 == 0:
                    print(f'  Copied {_copied:,}/{len(df_balanced):,}...')
            except Exception:
                _errors += 1
        else:
            _errors += 1

    print(f'\n✅ Copied {_copied:,} images')
    if _errors > 0:
        print(f'⚠️  Errors: {_errors}')

    print(f'\n📊 Final distribution:')
    for _cls in CLASSES:
        _count = len(list((OUTPUT_PATH / _cls).glob('*.jpg')))
        print(f'  {_cls:12s}: {_count:,}')

    print(f'\n✅ Dataset prepared at: {OUTPUT_PATH}')
    print('🚀 Ready to train with 02_train.py!')
    return


if __name__ == "__main__":
    app.run()
