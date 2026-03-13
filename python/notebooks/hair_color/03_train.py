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
    # Hair Color Classification with MobileNetV2

    4-class classification: **black**, **brown**, **blond**, **gray**

    ## Architecture
    - MobileNetV2 backbone (transfer learning from ImageNet)
    - Two-phase training: frozen backbone → fine-tune last 30 layers
    - ~2.5MB after TFJS uint8 quantization
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
    mo.md(r"""
    ## Configuration
    """)
    return


@app.cell
def _(Path, np, tf):
    np.random.seed(42)
    tf.random.set_seed(42)

    DATA_PATH = Path('./data/celeba-hair')
    MODEL_OUTPUT_PATH = Path('./models/hair_color')
    MODEL_OUTPUT_PATH.mkdir(exist_ok=True)

    HAIR_COLORS = ['black', 'brown', 'blond', 'gray']
    IMG_SIZE = 128
    BATCH_SIZE = 32

    print(f"📁 Data: {DATA_PATH}")
    print(f"📁 Output: {MODEL_OUTPUT_PATH}")
    print(f"\n⚙️  Config:")
    print(f"   Image size: {IMG_SIZE}x{IMG_SIZE}")
    print(f"   Batch size: {BATCH_SIZE}")
    print(f"   Classes: {HAIR_COLORS}")
    return BATCH_SIZE, DATA_PATH, HAIR_COLORS, IMG_SIZE, MODEL_OUTPUT_PATH


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Load Dataset
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
                print(f'⚠️  {color_path} not found')
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

    print('📁 Loading dataset...\n')
    X, y = _load_dataset(DATA_PATH, IMG_SIZE, HAIR_COLORS)

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
def _(Counter, HAIR_COLORS, compute_class_weight, np, tf, y_train, y_val):
    print('📊 Train distribution:')
    _train_dist = Counter(y_train)
    for _idx, _color in enumerate(HAIR_COLORS):
        _count = _train_dist[_idx]
        _pct = 100 * _count / len(y_train)
        print(f'   {_color:8s}: {_count:,} ({_pct:.1f}%)')

    print('\n📊 Val distribution:')
    _val_dist = Counter(y_val)
    for _idx, _color in enumerate(HAIR_COLORS):
        _count = _val_dist[_idx]
        _pct = 100 * _count / len(y_val)
        print(f'   {_color:8s}: {_count:,} ({_pct:.1f}%)')

    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(y_train),
        y=y_train
    )
    class_weight_dict = {i: w for i, w in enumerate(class_weights)}

    print('\n⚖️  Class weights:')
    for _idx, _color in enumerate(HAIR_COLORS):
        print(f'   {_color:8s}: {class_weight_dict[_idx]:.3f}')

    y_train_cat = tf.keras.utils.to_categorical(y_train, len(HAIR_COLORS))
    y_val_cat = tf.keras.utils.to_categorical(y_val, len(HAIR_COLORS))
    return class_weight_dict, y_train_cat, y_val_cat


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Data Augmentation
    """)
    return


@app.cell
def _():
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    # No channel_shift or brightness_range — color IS the signal for hair color
    datagen = ImageDataGenerator(
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    print("✅ Data augmentation configured")
    return (datagen,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Model Architecture
    """)
    return


@app.cell
def _(HAIR_COLORS, IMG_SIZE, tf):
    base_model = tf.keras.applications.MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )

    # Phase 1: freeze entire backbone, train head only
    base_model.trainable = False

    inputs = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = tf.keras.layers.Rescaling(scale=2.0, offset=-1.0)(inputs)
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dense(128, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(len(HAIR_COLORS), activation='softmax')(x)
    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.legacy.Adam(learning_rate=1e-3),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
        metrics=['accuracy']
    )

    model.summary()
    return base_model, model


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Phase 1: Train Head (Backbone Frozen)
    """)
    return


@app.cell
def _(
    BATCH_SIZE,
    X_train,
    X_val,
    class_weight_dict,
    datagen,
    model,
    tf,
    y_train_cat,
    y_val_cat,
):
    print('🚀 Phase 1: Training classification head...\n')

    history_phase1 = model.fit(
        datagen.flow(X_train, y_train_cat, batch_size=BATCH_SIZE),
        steps_per_epoch=len(X_train) // BATCH_SIZE,
        epochs=10,
        validation_data=(X_val, y_val_cat),
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_accuracy', patience=5,
                restore_best_weights=True, mode='max', verbose=1
            ),
        ],
        class_weight=class_weight_dict,
        verbose=1
    )

    print(f'\n✅ Phase 1 complete!')
    print(f'   Best val accuracy: {max(history_phase1.history["val_accuracy"])*100:.2f}%')
    return (history_phase1,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Phase 2: Fine-tune Backbone
    """)
    return


@app.cell
def _(
    BATCH_SIZE,
    MODEL_OUTPUT_PATH,
    X_train,
    X_val,
    base_model,
    class_weight_dict,
    datagen,
    model,
    tf,
    y_train_cat,
    y_val_cat,
):
    # Unfreeze last 30 layers for fine-tuning
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.legacy.Adam(learning_rate=1e-4),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
        metrics=['accuracy']
    )

    steps_per_epoch = len(X_train) // BATCH_SIZE

    print('🚀 Phase 2: Fine-tuning backbone (last 30 layers)...\n')

    history_phase2 = model.fit(
        datagen.flow(X_train, y_train_cat, batch_size=BATCH_SIZE),
        steps_per_epoch=steps_per_epoch,
        epochs=40,
        validation_data=(X_val, y_val_cat),
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_accuracy', patience=10,
                restore_best_weights=True, mode='max', verbose=1
            ),
            tf.keras.callbacks.ModelCheckpoint(
                str(MODEL_OUTPUT_PATH / 'best_hair_color_model.keras'),
                monitor='val_accuracy', save_best_only=True,
                mode='max', verbose=1
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss', factor=0.5, patience=5,
                min_lr=1e-6, verbose=1
            ),
        ],
        class_weight=class_weight_dict,
        verbose=1
    )

    print(f'\n✅ Phase 2 complete!')
    print(f'   Best val accuracy: {max(history_phase2.history["val_accuracy"])*100:.2f}%')
    return (history_phase2,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Training History
    """)
    return


@app.cell
def _(history_phase1, history_phase2, plt):
    _val_acc = history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy']
    _acc = history_phase1.history['accuracy'] + history_phase2.history['accuracy']
    _loss = history_phase1.history['loss'] + history_phase2.history['loss']
    _val_loss = history_phase1.history['val_loss'] + history_phase2.history['val_loss']
    _p1_epochs = len(history_phase1.history['accuracy'])

    _fig, _axes = plt.subplots(1, 2, figsize=(14, 5))

    _axes[0].plot(_acc, label='Train', linewidth=2)
    _axes[0].plot(_val_acc, label='Validation', linewidth=2)
    _axes[0].axvline(x=_p1_epochs - 0.5, color='gray', linestyle='--', alpha=0.5, label='Fine-tune start')
    _axes[0].set_title('Model Accuracy', fontsize=14, fontweight='bold')
    _axes[0].set_xlabel('Epoch')
    _axes[0].set_ylabel('Accuracy')
    _axes[0].legend()
    _axes[0].grid(True, alpha=0.3)

    _axes[1].plot(_loss, label='Train', linewidth=2)
    _axes[1].plot(_val_loss, label='Validation', linewidth=2)
    _axes[1].axvline(x=_p1_epochs - 0.5, color='gray', linestyle='--', alpha=0.5, label='Fine-tune start')
    _axes[1].set_title('Model Loss', fontsize=14, fontweight='bold')
    _axes[1].set_xlabel('Epoch')
    _axes[1].set_ylabel('Loss')
    _axes[1].legend()
    _axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.show()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Evaluation
    """)
    return


@app.cell
def _(Counter, HAIR_COLORS, X_val, classification_report, model, np, y_val):
    y_pred_probs = model.predict(X_val, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)

    print('📊 Classification Report:')
    print('=' * 60)
    print(classification_report(y_val, y_pred, target_names=HAIR_COLORS, zero_division=0))

    _val_accuracy = np.mean(y_val == y_pred)
    print(f'\n✅ Validation Accuracy: {_val_accuracy * 100:.2f}%')

    print('\n📊 Prediction Distribution:')
    _pred_counts = Counter(y_pred)
    for _idx, _color in enumerate(HAIR_COLORS):
        _count = _pred_counts.get(_idx, 0)
        _pct = 100 * _count / len(y_pred)
        _bar = '█' * int(_pct / 5)
        print(f'   {_color:8s}: {_count:,} ({_pct:5.1f}%) {_bar}')
    return (y_pred,)


@app.cell
def _(
    HAIR_COLORS,
    confusion_matrix,
    np,
    plt,
    sns,
    y_pred,
    y_val,
):
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
    ## Convert to TensorFlow.js
    """)
    return


@app.cell
def _(HAIR_COLORS, MODEL_OUTPUT_PATH, json, model):
    import tensorflowjs as tfjs

    print('\n' + '=' * 60)
    print('🔄 Converting to TensorFlow.js...')
    print('=' * 60)

    TFJS_OUTPUT = MODEL_OUTPUT_PATH / 'hair_color' / 'tfjs'
    TFJS_OUTPUT.mkdir(parents=True, exist_ok=True)

    tfjs.converters.save_keras_model(
        model,
        str(TFJS_OUTPUT),
        quantization_dtype_map={'uint8': '*'}
    )

    with open(TFJS_OUTPUT / 'classes.json', 'w') as _f:
        json.dump(HAIR_COLORS, _f, indent=2)

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
    return


if __name__ == "__main__":
    app.run()
