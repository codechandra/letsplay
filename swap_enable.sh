#!/bin/bash
set -e

# Size of swap inside the file 2G
SWAP_SIZE=2G
SWAP_FILE=/swapfile

echo ">>> Checking if swap exists..."
if [ -f "$SWAP_FILE" ]; then
    echo "Swap file already exists."
else
    echo "Creating $SWAP_SIZE swap file..."
    sudo fallocate -l $SWAP_SIZE $SWAP_FILE
    sudo chmod 600 $SWAP_FILE
    sudo mkswap $SWAP_FILE
    sudo swapon $SWAP_FILE
    echo "$SWAP_FILE none swap sw 0 0" | sudo tee -a /etc/fstab
    echo "Swap enabled!"
fi

echo ">>> Current Memory Status:"
free -h
