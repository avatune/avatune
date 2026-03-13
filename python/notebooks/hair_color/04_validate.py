import marimo

__generated_with = "0.20.4"
app = marimo.App()


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Hair Color Model Validation

    Loads `best_hair_color_model.keras` and evaluates on the validation split.
    Saves results to `validation.json`.
    """)
    return


@app.cell
def _():
    import os
    os.environ["TF_USE_LEGACY_KERAS"] = "1"

    import tensorflow as tf
    import numpy as np
    import cv2
    from pathlib import Path
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import confusion_matrix, classification_report
    import json
    from datetime import date

    print(f"TensorFlow version: {tf.__version__}")
    return (
        Path,
        classification_report,
        confusion_matrix,
        cv2,
        date,
        json,
        np,
        plt,
        sns,
        tf,
        train_test_split,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Configuration
    """)
    return


@app.cell
def _(Path):
    DATA_PATH = Path('./data/celeba-hair')
    MODEL_PATH = Path('./models/hair_color/best_hair_color_model.keras')
    OUTPUT_PATH = Path('./models/hair_color')

    HAIR_COLORS = ['black', 'brown', 'blond', 'gray']
    IMG_SIZE = 128

    print(f"Model: {MODEL_PATH}")
    print(f"Data: {DATA_PATH}")
    print(f"Classes: {HAIR_COLORS}")
    return DATA_PATH, HAIR_COLORS, IMG_SIZE, MODEL_PATH, OUTPUT_PATH


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Load Model
    """)
    return


@app.cell
def _(MODEL_PATH, tf):
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Loaded model from {MODEL_PATH}")
    print(f"Parameters: {model.count_params():,}")
    return (model,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Load Validation Data
    """)
    return


@app.cell
def _(DATA_PATH, HAIR_COLORS, IMG_SIZE, cv2, np, train_test_split):
    def _load_dataset(data_path, img_size, colors):
        images = []
        labels = []

        for color_idx, color in enumerate(colors):
            color_path = data_path / color
            if not color_path.exists():
                print(f'{color_path} not found')
                continue

            image_files = list(color_path.glob('*.jpg'))
            print(f'Loading {len(image_files):,} {color} hair images...')

            for img_file in image_files:
                try:
                    img = cv2.imread(str(img_file))
                    if img is None:
                        continue
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    img = cv2.resize(img, (img_size, img_size))
                    images.append(img)
                    labels.append(color_idx)
                except Exception:
                    pass

        images = np.array(images, dtype=np.float32) / 255.0
        labels = np.array(labels)
        return images, labels

    X, y = _load_dataset(DATA_PATH, IMG_SIZE, HAIR_COLORS)

    _, X_val, _, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f'\nValidation set: {len(X_val):,} images')
    return X_val, y_val


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Predictions & Classification Report
    """)
    return


@app.cell
def _(HAIR_COLORS, X_val, classification_report, model, np, y_val):
    y_pred_probs = model.predict(X_val, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)

    accuracy = float(np.mean(y_val == y_pred))
    print(f'Validation Accuracy: {accuracy * 100:.2f}%\n')

    print(classification_report(y_val, y_pred, target_names=HAIR_COLORS, zero_division=0))

    per_class_acc = {}
    for idx, color in enumerate(HAIR_COLORS):
        mask = y_val == idx
        if mask.sum() > 0:
            class_acc = float((y_pred[mask] == idx).sum() / mask.sum())
            per_class_acc[color] = round(class_acc, 4)
            print(f'  {color:8s}: {class_acc * 100:5.1f}% (n={mask.sum()})')

    return accuracy, per_class_acc, y_pred


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Confusion Matrix
    """)
    return


@app.cell
def _(HAIR_COLORS, confusion_matrix, np, plt, sns, y_pred, y_val):
    _cm = confusion_matrix(y_val, y_pred)
    _cm_norm = _cm.astype('float') / _cm.sum(axis=1)[:, np.newaxis]

    _fig, _axes = plt.subplots(1, 2, figsize=(16, 6))

    sns.heatmap(_cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=HAIR_COLORS, yticklabels=HAIR_COLORS, ax=_axes[0])
    _axes[0].set_title('Confusion Matrix (Counts)', fontsize=14, fontweight='bold')
    _axes[0].set_ylabel('True Label')
    _axes[0].set_xlabel('Predicted Label')

    sns.heatmap(_cm_norm, annot=True, fmt='.2f', cmap='Blues',
                xticklabels=HAIR_COLORS, yticklabels=HAIR_COLORS, ax=_axes[1])
    _axes[1].set_title('Confusion Matrix (Normalized)', fontsize=14, fontweight='bold')
    _axes[1].set_ylabel('True Label')
    _axes[1].set_xlabel('Predicted Label')

    plt.tight_layout()
    plt.show()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Save Validation Results
    """)
    return


@app.cell
def _(MODEL_PATH, OUTPUT_PATH, accuracy, date, json, per_class_acc):
    results = {
        'accuracy': round(accuracy, 4),
        'per_class_accuracy': per_class_acc,
        'model_file': MODEL_PATH.name,
        'date': str(date.today()),
    }

    output_file = OUTPUT_PATH / 'validation.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    print(f'Saved validation results to {output_file}')
    print(json.dumps(results, indent=2))
    return


if __name__ == "__main__":
    app.run()
