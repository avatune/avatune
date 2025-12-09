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
    # Train Facial Hair Classifier (Binary)

    Binary classification: **none** vs **facial_hair**

    ## Model Architecture
    - MobileNetV2 backbone (transfer learning)
    - Fine-tuned top layers for facial hair detection
    - ~500KB after TFJS quantization
    """
    )
    return


@app.cell
def _():
    import os
    # Use legacy Keras for TensorFlow.js compatibility
    os.environ["TF_USE_LEGACY_KERAS"] = "1"

    import tensorflow as tf
    import numpy as np
    import cv2
    from pathlib import Path
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import confusion_matrix, classification_report
    from sklearn.utils.class_weight import compute_class_weight
    from collections import Counter
    import json

    print(f"TensorFlow version: {tf.__version__}")

    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            print(f"✅ Found {len(gpus)} GPU(s)")
        except RuntimeError as e:
            print(f"⚠️  GPU config error: {e}")
    else:
        print("⚠️  No GPU found, using CPU")

    print(f"🎯 Device: {tf.test.gpu_device_name() or 'CPU'}")
    return (
        Counter,
        Path,
        classification_report,
        compute_class_weight,
        confusion_matrix,
        cv2,
        json,
        np,
        plt,
        sns,
        tf,
        train_test_split,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Configuration""")
    return


@app.cell
def _(Path, np, tf):
    np.random.seed(42)
    tf.random.set_seed(42)

    DATA_PATH = Path('./data/celeba-facial-hair')
    MODEL_OUTPUT_PATH = Path('./models/facial_hair')
    MODEL_OUTPUT_PATH.mkdir(parents=True, exist_ok=True)

    CLASSES = ['none', 'facial_hair']
    IMG_SIZE = 128
    BATCH_SIZE = 32
    EPOCHS = 30
    LEARNING_RATE = 0.0001  # Lower LR for transfer learning

    print(f"📁 Data: {DATA_PATH}")
    print(f"📁 Output: {MODEL_OUTPUT_PATH}")
    print(f"\n⚙️  Config:")
    print(f"   Image size: {IMG_SIZE}x{IMG_SIZE}")
    print(f"   Batch size: {BATCH_SIZE}")
    print(f"   Epochs: {EPOCHS}")
    print(f"   Learning rate: {LEARNING_RATE}")
    print(f"   Classes: {CLASSES}")
    return (
        BATCH_SIZE,
        CLASSES,
        DATA_PATH,
        EPOCHS,
        IMG_SIZE,
        LEARNING_RATE,
        MODEL_OUTPUT_PATH,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Load Dataset""")
    return


@app.cell
def _(CLASSES, DATA_PATH, IMG_SIZE, cv2, np, train_test_split):
    def _load_dataset(data_path, img_size, classes):
        images = []
        labels = []

        for cls_idx, cls in enumerate(classes):
            cls_path = data_path / cls
            if not cls_path.exists():
                print(f'⚠️  {cls_path} not found')
                continue

            image_files = list(cls_path.glob('*.jpg'))
            print(f'Loading {len(image_files):,} {cls} images...')

            for img_file in image_files:
                try:
                    img = cv2.imread(str(img_file))
                    if img is None:
                        continue
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    img = cv2.resize(img, (img_size, img_size))
                    images.append(img)
                    labels.append(cls_idx)
                except Exception:
                    pass

        images = np.array(images, dtype=np.float32) / 255.0
        labels = np.array(labels)
        return images, labels

    print('📁 Loading dataset...\n')
    X, y = _load_dataset(DATA_PATH, IMG_SIZE, CLASSES)

    print(f'\n✅ Dataset loaded:')
    print(f'   Shape: {X.shape}')
    print(f'   Memory: ~{X.nbytes / 1024 / 1024:.1f} MB')

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f'\n📊 Split:')
    print(f'   Train: {len(X_train):,}')
    print(f'   Val: {len(X_val):,}')
    return X_train, X_val, y_train, y_val


@app.cell
def _(CLASSES, Counter, compute_class_weight, np, tf, y_train, y_val):
    print('📊 Train distribution:')
    _train_dist = Counter(y_train)
    for _idx, _cls in enumerate(CLASSES):
        _count = _train_dist[_idx]
        _pct = 100 * _count / len(y_train)
        print(f'   {_cls:12s}: {_count:,} ({_pct:.1f}%)')

    print('\n📊 Val distribution:')
    _val_dist = Counter(y_val)
    for _idx, _cls in enumerate(CLASSES):
        _count = _val_dist[_idx]
        _pct = 100 * _count / len(y_val)
        print(f'   {_cls:12s}: {_count:,} ({_pct:.1f}%)')

    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(y_train),
        y=y_train
    )
    class_weight_dict = {i: w for i, w in enumerate(class_weights)}

    print('\n⚖️  Class weights:')
    for _idx, _cls in enumerate(CLASSES):
        print(f'   {_cls:12s}: {class_weight_dict[_idx]:.3f}')

    y_train_cat = tf.keras.utils.to_categorical(y_train, len(CLASSES))
    y_val_cat = tf.keras.utils.to_categorical(y_val, len(CLASSES))
    return class_weight_dict, y_train_cat, y_val_cat


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Model Architecture""")
    return


@app.cell
def _(CLASSES, IMG_SIZE, LEARNING_RATE, tf):
    def _create_model(input_shape, num_classes, learning_rate):
        # MobileNetV2 backbone for transfer learning
        base_model = tf.keras.applications.MobileNetV2(
            weights="imagenet",
            include_top=False,
            input_shape=input_shape
        )

        # Freeze early layers, fine-tune last 30
        for layer in base_model.layers[:-30]:
            layer.trainable = False
        for layer in base_model.layers[-30:]:
            layer.trainable = True

        _model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(num_classes, activation='softmax')
        ])

        _model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        return _model

    model = _create_model(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        num_classes=len(CLASSES),
        learning_rate=LEARNING_RATE
    )

    model.summary()
    return (model,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Training""")
    return


@app.cell
def _(MODEL_OUTPUT_PATH, tf):
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=10,
            restore_best_weights=True,
            mode='max',
            verbose=1
        ),
        tf.keras.callbacks.ModelCheckpoint(
            str(MODEL_OUTPUT_PATH / 'best_facial_hair_model.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-6,
            verbose=1
        )
    ]

    print("✅ Callbacks configured")
    return (callbacks,)


@app.cell
def _(
    BATCH_SIZE,
    EPOCHS,
    X_train,
    X_val,
    callbacks,
    class_weight_dict,
    model,
    y_train_cat,
    y_val_cat,
):
    print('🚀 Starting training...\n')

    history = model.fit(
        X_train, y_train_cat,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=(X_val, y_val_cat),
        callbacks=callbacks,
        class_weight=class_weight_dict,
        verbose=1
    )

    print('\n✅ Training complete!')
    return (history,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Training History""")
    return


@app.cell
def _(MODEL_OUTPUT_PATH, history, plt):
    _fig, _axes = plt.subplots(1, 2, figsize=(14, 5))

    _axes[0].plot(history.history['accuracy'], label='Train', linewidth=2)
    _axes[0].plot(history.history['val_accuracy'], label='Validation', linewidth=2)
    _axes[0].set_title('Model Accuracy', fontsize=14, fontweight='bold')
    _axes[0].set_xlabel('Epoch')
    _axes[0].set_ylabel('Accuracy')
    _axes[0].legend()
    _axes[0].grid(True, alpha=0.3)

    _axes[1].plot(history.history['loss'], label='Train', linewidth=2)
    _axes[1].plot(history.history['val_loss'], label='Validation', linewidth=2)
    _axes[1].set_title('Model Loss', fontsize=14, fontweight='bold')
    _axes[1].set_xlabel('Epoch')
    _axes[1].set_ylabel('Loss')
    _axes[1].legend()
    _axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'training_history.png', dpi=150)
    plt.show()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Evaluation""")
    return


@app.cell
def _(CLASSES, Counter, X_val, classification_report, model, np, y_val):
    y_pred_probs = model.predict(X_val, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)

    print('📊 Classification Report:')
    print('=' * 60)
    print(classification_report(y_val, y_pred, target_names=CLASSES, zero_division=0))

    _val_accuracy = np.mean(y_val == y_pred)
    print(f'\n✅ Validation Accuracy: {_val_accuracy * 100:.2f}%')

    print('\n📊 Prediction Distribution:')
    _pred_counts = Counter(y_pred)
    for _idx, _cls in enumerate(CLASSES):
        _count = _pred_counts.get(_idx, 0)
        _pct = 100 * _count / len(y_pred)
        _bar = '█' * int(_pct / 5)
        print(f'   {_cls:12s}: {_count:,} ({_pct:5.1f}%) {_bar}')
    return y_pred, y_pred_probs


@app.cell
def _(CLASSES, MODEL_OUTPUT_PATH, confusion_matrix, np, plt, sns, y_pred, y_val):
    _cm = confusion_matrix(y_val, y_pred)
    _cm_norm = _cm.astype('float') / _cm.sum(axis=1)[:, np.newaxis]

    _fig, _axes = plt.subplots(1, 2, figsize=(12, 4))

    sns.heatmap(_cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=CLASSES, yticklabels=CLASSES, ax=_axes[0])
    _axes[0].set_title('Confusion Matrix (Counts)', fontsize=14, fontweight='bold')
    _axes[0].set_ylabel('True Label')
    _axes[0].set_xlabel('Predicted Label')

    sns.heatmap(_cm_norm, annot=True, fmt='.2f', cmap='Blues',
                xticklabels=CLASSES, yticklabels=CLASSES, ax=_axes[1])
    _axes[1].set_title('Confusion Matrix (Normalized)', fontsize=14, fontweight='bold')
    _axes[1].set_ylabel('True Label')
    _axes[1].set_xlabel('Predicted Label')

    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'confusion_matrix.png', dpi=150)
    plt.show()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Save Model""")
    return


@app.cell
def _(CLASSES, MODEL_OUTPUT_PATH, history, json, model):
    print("💾 Saving model...")

    model.save(MODEL_OUTPUT_PATH / 'facial_hair_model.keras')
    print(f"✅ Saved: facial_hair_model.keras")

    with open(MODEL_OUTPUT_PATH / 'classes.json', 'w') as f:
        json.dump(CLASSES, f, indent=2)
    print(f"✅ Saved: classes.json")

    _history_dict = {
        'accuracy': [float(x) for x in history.history['accuracy']],
        'val_accuracy': [float(x) for x in history.history['val_accuracy']],
        'loss': [float(x) for x in history.history['loss']],
        'val_loss': [float(x) for x in history.history['val_loss']],
        'epochs': len(history.history['accuracy']),
        'final_val_accuracy': float(history.history['val_accuracy'][-1]),
        'best_val_accuracy': float(max(history.history['val_accuracy']))
    }

    with open(MODEL_OUTPUT_PATH / 'training_history.json', 'w') as f:
        json.dump(_history_dict, f, indent=2)
    print(f"✅ Saved: training_history.json")

    print(f"\n🎉 Training Complete!")
    print(f"=" * 60)
    print(f"📊 Final Results:")
    print(f"   Train accuracy: {history.history['accuracy'][-1]*100:.2f}%")
    print(f"   Val accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")
    print(f"   Best val accuracy: {max(history.history['val_accuracy'])*100:.2f}%")
    print(f"   Epochs trained: {len(history.history['accuracy'])}")
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Convert to TensorFlow.js""")
    return


@app.cell
def _(MODEL_OUTPUT_PATH, model):
    import tensorflowjs as tfjs
    import shutil

    print('\n' + '=' * 60)
    print('🔄 Converting to TensorFlow.js...')
    print('=' * 60)

    TFJS_OUTPUT = MODEL_OUTPUT_PATH / 'tfjs'
    TFJS_OUTPUT.mkdir(parents=True, exist_ok=True)

    tfjs.converters.save_keras_model(
        model,
        str(TFJS_OUTPUT),
        quantization_dtype_map={'uint8': '*'}
    )

    shutil.copy(MODEL_OUTPUT_PATH / 'classes.json', TFJS_OUTPUT / 'classes.json')

    print('\n✅ TensorFlow.js conversion complete!')
    print(f'\n📁 Generated files:')

    _total_size = 0
    for _file in sorted(TFJS_OUTPUT.glob('*')):
        _size = _file.stat().st_size / 1024
        _total_size += _size
        print(f'   - {_file.name}: {_size:.1f} KB')

    print(f'\n📦 Total size: {_total_size:.1f} KB ({_total_size / 1024:.2f} MB)')
    print(f'\n🎯 Ready for deployment!')
    print(f'   Location: {TFJS_OUTPUT}')
    return TFJS_OUTPUT, shutil, tfjs


if __name__ == "__main__":
    app.run()
