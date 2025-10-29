import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell
def _():
    import tensorflow as tf
    import numpy as np
    import cv2
    from pathlib import Path
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import confusion_matrix, classification_report
    from sklearn.utils.class_weight import compute_class_weight
    import json

    print(f"TensorFlow version: {tf.__version__}")


    # Configure GPU
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        try:
            # Enable memory growth
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
        
            print(f"✅ Found {len(gpus)} GPU(s)")
            print(f"   Using GPU: {gpus[0].name}")
        
            # Set GPU as default device
            tf.config.set_visible_devices(gpus[0], 'GPU')
        
        except RuntimeError as e:
            print(f"⚠️  GPU configuration error: {e}")
    else:
        print("⚠️  No GPU found, using CPU")

    # Verify device placement
    print(f"\n🎯 Default device: {tf.test.gpu_device_name() or 'CPU'}")
    return (
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


@app.cell
def _(Path, np, tf):
    np.random.seed(42)
    tf.random.set_seed(42)

    # Cell 2: Configuration
    DATA_PATH = Path('../../data/celeba-hair')
    MODEL_OUTPUT_PATH = Path('../../models/hair_color')
    MODEL_OUTPUT_PATH.mkdir(exist_ok=True)

    HAIR_COLORS = ['black', 'brown', 'blond', 'gray']
    IMG_SIZE = 128  # Hair needs more context than eyes
    BATCH_SIZE = 32
    EPOCHS = 20
    LEARNING_RATE = 0.0001

    print(f"Training configuration:")
    print(f"  Image size: {IMG_SIZE}x{IMG_SIZE}")
    print(f"  Batch size: {BATCH_SIZE}")
    print(f"  Epochs: {EPOCHS}")
    print(f"  Classes: {HAIR_COLORS}")
    return (
        BATCH_SIZE,
        DATA_PATH,
        EPOCHS,
        HAIR_COLORS,
        IMG_SIZE,
        LEARNING_RATE,
        MODEL_OUTPUT_PATH,
    )


@app.cell
def _(DATA_PATH, HAIR_COLORS, IMG_SIZE, cv2, np, tf, train_test_split):
    def load_hair_dataset(data_path, img_size=128):
        """Load hair color dataset"""
        images = []
        labels = []
        for color_idx, _color in enumerate(HAIR_COLORS):
            color_path = data_path / _color
            if not color_path.exists():
                print(f'⚠️  Warning: {color_path} directory not found')
                continue
            image_files = list(color_path.glob('*.jpg'))
            print(f'Loading {len(image_files)} {_color} hair images...')
            for img_file in image_files:
                try:
                    img = cv2.imread(str(img_file))
                    if img is None:
                        continue
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    img = cv2.resize(img, (img_size, img_size))
                    images.append(img)
                    labels.append(color_idx)
                except Exception as e:
                    print(f'Error loading {img_file}: {e}')
        images = np.array(images, dtype=np.float32) / 255.0
        labels = np.array(labels)
        return (images, labels)
    print('📁 Loading dataset...')
    X, y = load_hair_dataset(DATA_PATH, IMG_SIZE)
    print(f'\n✅ Dataset loaded:')
    print(f'  Images shape: {X.shape}')
    print(f'  Labels shape: {y.shape}')
    print(f'  Memory: ~{X.nbytes / 1024 / 1024:.1f} MB')
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f'\n📊 Data split:')
    print(f'  Training set: {X_train.shape[0]} samples')
    print(f'  Validation set: {X_val.shape[0]} samples')
    y_train_cat = tf.keras.utils.to_categorical(y_train, len(HAIR_COLORS))
    # Cell 4: Train/validation split
    y_val_cat = tf.keras.utils.to_categorical(y_val, len(HAIR_COLORS))
    return X_train, X_val, y_train, y_val


@app.cell
def _(
    Counter,
    HAIR_COLORS,
    X_train,
    X_val,
    compute_class_weight,
    np,
    tf,
    y_train,
    y_val,
):
    print(f'\nSplit:')
    print(f'  Train: {X_train.shape[0]}')
    print(f'  Val: {X_val.shape[0]}')
    y_train_cat_1 = tf.keras.utils.to_categorical(y_train, len(HAIR_COLORS))
    y_val_cat_1 = tf.keras.utils.to_categorical(y_val, len(HAIR_COLORS))
    print('\nTrain distribution:')
    train_dist = Counter(y_train)
    for _idx, _color in enumerate(HAIR_COLORS):
        _count = train_dist[_idx]
        print(f'  {_color}: {_count}')
    print('\nVal distribution:')
    val_dist = Counter(y_val)
    for _idx, _color in enumerate(HAIR_COLORS):
        _count = val_dist[_idx]
        print(f'  {_color}: {_count}')
    class_weights = compute_class_weight(class_weight='balanced', classes=np.unique(y_train), y=y_train)
    class_weight_dict = {i: weight for i, weight in enumerate(class_weights)}
    print('\n⚖️  Class Weights:')
    for _idx, _color in enumerate(HAIR_COLORS):
        print(f'  {_color:8s}: {class_weight_dict[_idx]:.3f}')
    return y_train_cat_1, y_val_cat_1


@app.cell
def _():
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    datagen = ImageDataGenerator(
        rotation_range=5,          # Reduced from 10
        width_shift_range=0.05,    # Reduced from 0.1
        height_shift_range=0.05,   # Reduced from 0.1
        brightness_range=[0.9, 1.1], # Reduced from [0.8, 1.2]
        zoom_range=0.05,           # Reduced from 0.1
        horizontal_flip=True,
        fill_mode='nearest'
    )

    print("✅ Data augmentation configured")
    return


@app.cell
def _(HAIR_COLORS, IMG_SIZE, LEARNING_RATE, tf):
    def create_hair_color_model(input_shape=(128, 128, 3), num_classes=4):
        """Simpler model with gradient clipping"""
    
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=input_shape),
        
            # Block 1 - Simple
            tf.keras.layers.Conv2D(32, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
            tf.keras.layers.Dropout(0.2),
        
            # Block 2
            tf.keras.layers.Conv2D(64, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
            tf.keras.layers.Dropout(0.2),
        
            # Block 3
            tf.keras.layers.Conv2D(128, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
            tf.keras.layers.Dropout(0.3),
        
            # Classifier
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dropout(0.4),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(num_classes, activation='softmax')
        ])
    
        # Adam with VERY low learning rate and gradient clipping
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
    
        return model

    model = create_hair_color_model(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        num_classes=len(HAIR_COLORS)
    )

    model.summary()
    return (model,)


@app.cell
def _(MODEL_OUTPUT_PATH, tf):
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_accuracy',  # Monitor accuracy instead of loss
            patience=15,
            restore_best_weights=True,
            mode='max',  # Maximize accuracy
            verbose=1
        ),
        tf.keras.callbacks.ModelCheckpoint(
            str(MODEL_OUTPUT_PATH / 'best_hair_color_model.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
    ]
    return (callbacks,)


@app.cell
def _(
    BATCH_SIZE,
    EPOCHS,
    X_train,
    X_val,
    callbacks,
    model,
    y_train_cat_1,
    y_val_cat_1,
):
    print('🚀 Starting training on Metal GPU...\n')
    history = model.fit(X_train, y_train_cat_1, batch_size=BATCH_SIZE, epochs=EPOCHS, validation_data=(X_val, y_val_cat_1), callbacks=callbacks, verbose=1)
    print('\n✅ Training complete!')  # Direct data, NO generator  # NO class_weight for now
    return (history,)


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
    plt.savefig(MODEL_OUTPUT_PATH / 'hair_color_history.png', dpi=150)
    plt.show()
    return


@app.cell
def _(HAIR_COLORS, X_val, classification_report, model, np, y_val):
    from collections import Counter
    y_pred_probs = model.predict(X_val, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)
    print('\nClassification Report:')
    print('=' * 60)
    print(classification_report(y_val, y_pred, target_names=HAIR_COLORS, zero_division=0))
    val_accuracy = np.mean(y_val == y_pred)
    print(f'\n✅ Validation Accuracy: {val_accuracy * 100:.2f}%')
    print('\n📊 Prediction Distribution:')
    pred_counts = Counter(y_pred)
    for _idx, _color in enumerate(HAIR_COLORS):
        _count = pred_counts.get(_idx, 0)  # Add this to suppress warning
        percentage = _count / len(y_pred) * 100
        bar = '█' * int(percentage / 5)
        print(f'  {_color:8s}: {_count:6d} ({percentage:5.1f}%) {bar}')
    zero_pred_classes = [HAIR_COLORS[i] for i in range(len(HAIR_COLORS)) if pred_counts.get(i, 0) == 0]
    if zero_pred_classes:
    # Show which classes are actually being predicted
        print(f"\n⚠️  Classes with ZERO predictions: {', '.join(zero_pred_classes)}")
    # Show which classes have zero predictions
        print('   This means the model is not learning all classes!')
    return Counter, y_pred


@app.cell
def _(
    HAIR_COLORS,
    MODEL_OUTPUT_PATH,
    confusion_matrix,
    np,
    plt,
    sns,
    y_pred,
    y_val,
):
    cm = confusion_matrix(y_val, y_pred)
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    _fig, _axes = plt.subplots(1, 2, figsize=(16, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=HAIR_COLORS, yticklabels=HAIR_COLORS, ax=_axes[0], cbar_kws={'label': 'Count'})
    _axes[0].set_title('Confusion Matrix (Counts)', fontsize=14, fontweight='bold')
    _axes[0].set_ylabel('True Label')
    _axes[0].set_xlabel('Predicted Label')
    sns.heatmap(cm_normalized, annot=True, fmt='.2f', cmap='Blues', xticklabels=HAIR_COLORS, yticklabels=HAIR_COLORS, ax=_axes[1], cbar_kws={'label': 'Percentage'})
    _axes[1].set_title('Confusion Matrix (Normalized)', fontsize=14, fontweight='bold')
    _axes[1].set_ylabel('True Label')
    _axes[1].set_xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'hair_color_confusion.png', dpi=150)
    plt.show()
    return


@app.cell
def _(HAIR_COLORS, MODEL_OUTPUT_PATH, history, json, model):
    print("\n💾 Saving model...")

    # Save in modern Keras format
    model.save(MODEL_OUTPUT_PATH / 'hair_color_model.keras')  # Changed from .h5
    print(f"✅ Saved: hair_color_model.keras")

    # Save class names
    with open(MODEL_OUTPUT_PATH / 'hair_color_classes.json', 'w') as f:
        json.dump(HAIR_COLORS, f, indent=2)
    print(f"✅ Saved: hair_color_classes.json")

    # Save training history
    history_dict = {
        'accuracy': [float(x) for x in history.history['accuracy']],
        'val_accuracy': [float(x) for x in history.history['val_accuracy']],
        'loss': [float(x) for x in history.history['loss']],
        'val_loss': [float(x) for x in history.history['val_loss']],
        'epochs': len(history.history['accuracy']),
        'final_val_accuracy': float(history.history['val_accuracy'][-1]),
        'best_val_accuracy': float(max(history.history['val_accuracy']))
    }

    with open(MODEL_OUTPUT_PATH / 'hair_color_history.json', 'w') as f:
        json.dump(history_dict, f, indent=2)
    print(f"✅ Saved: hair_color_history.json")

    # Print summary
    print(f"\n🎉 Training Complete!")
    print(f"="*60)
    print(f"📊 Final Results:")
    print(f"   Training accuracy: {history.history['accuracy'][-1]*100:.2f}%")
    print(f"   Validation accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")
    print(f"   Best validation accuracy: {max(history.history['val_accuracy'])*100:.2f}%")
    print(f"   Total epochs: {len(history.history['accuracy'])}")
    print(f"\n📁 Files saved to: {MODEL_OUTPUT_PATH}")
    print(f"   - hair_color_model.keras ({(MODEL_OUTPUT_PATH / 'hair_color_model.keras').stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"   - hair_color_classes.json")
    print(f"   - hair_color_history.json")
    print(f"="*60)
    return


@app.cell
def _(MODEL_OUTPUT_PATH, model):
    # Convert to TensorFlow.js
    import tensorflowjs as tfjs
    import shutil
    print('\n' + '=' * 60)
    print('🔄 Converting to TensorFlow.js...')
    print('=' * 60)
    TFJS_OUTPUT = MODEL_OUTPUT_PATH / 'hair_color' / 'tfjs'
    TFJS_OUTPUT.mkdir(parents=True, exist_ok=True)
    print(f"\n📦 Loading model from: {MODEL_OUTPUT_PATH / 'hair_color_model.keras'}")
    print(f'📁 Output directory: {TFJS_OUTPUT}')
    tfjs.converters.save_keras_model(model, str(TFJS_OUTPUT), quantization_dtype_map={'uint8': '*'})
    shutil.copy(MODEL_OUTPUT_PATH / 'hair_color_classes.json', TFJS_OUTPUT / 'classes.json')
    print('\n✅ TensorFlow.js conversion complete!')
    print(f'\n📁 Generated files:')
    # Convert with quantization for smaller size
    total_size = 0
    for file in sorted(TFJS_OUTPUT.glob('*')):
        size = file.stat().st_size / 1024
        total_size = total_size + size
        print(f'   - {file.name}: {size:.1f} KB')
    print(f'\n📦 Total size: {total_size:.1f} KB ({total_size / 1024:.2f} MB)')
    # Copy classes file
    print(f'\n🎯 Ready for deployment!')
    print(f'   Location: {TFJS_OUTPUT}')
    return


if __name__ == "__main__":
    app.run()
